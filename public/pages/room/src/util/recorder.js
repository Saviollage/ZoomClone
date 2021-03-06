class Recorder {
    constructor(userName, stream) {
        this.userName = userName
        this.stream = stream
        this.fileName = `id:${userName}-at:${Date.now()}`
        this.videoType = "video/webm"

        this.mediaRecorder = {}
        this.recorderBlobs = []
        this.completeRecordings = []
        this.recordingActive = false
    }
    _setup() {
        const commonCodecs = ["codecs=vp9,opus", "codecs=vp8,opus", '']
        const options = commonCodecs
            .map(codec => ({ mimetype: `${this.videoType};${codec}` }))
            .find(options => MediaRecorder.isTypeSupported(options))
        if (!options) {
            throw new Error(`None of the codecs: ${commonCodecs.join(',')} are supported`)
        }
        return options
    }
    startRecording() {
        const options = this._setup()
        // Se não tiver recebendo stream
        if (!this.stream.active) return;
        this.mediaRecorder = new MediaRecorder(this.stream, options)
        this.mediaRecorder.onstop = (event) => {

        }
        this.mediaRecorder.ondataavaliable = (event) => {
            if (!event.data || !event.data.size) return;
            this.recorderBlobs.push(event.data)

        }
        this.mediaRecorder.start()
        this.recordingActive = true
    }
    async stopRecording() {
        if (!this.recordingActive) return;
        if (this.mediaRecorder.state === 'inactive') return;

        this.mediaRecorder.stop()
        this.recordingActive = false
        await Util.sleep(200)
        this.completeRecordings.push([...this.recorderBlobs])
        this.recorderBlobs = []
    }
    getAllVideosURLs() {
        return this.completeRecordings.map(recording => {
            const superBuffer = new Blob(recording, { type: this.videoType })
            return window.URL.createObjectURL(superBuffer)
        })
    }

    download() {
        if (!this.completeRecordings.length) return;
        for (const recording of this.completeRecordings) {
            const blob = new Blob(recording, { type: this.videoType })
            const url = window.URL.createObjectURL(superBuffer)
            const link = document.createElement('link')
            link.style.display = 'none'
            link.href = url
            link.download = `${this.fileName}.webm`
            document.body.appendChild(link)
            link.click()
        }
    }
}