class Media {
    async getCamera(audio = false, video = true, deviceId) {
        let id = deviceId;
        if (!deviceId) {
            const deviceList = await this.listDevices()
            id = deviceList[2].deviceId
        }
        return navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: id
            }, audio
        })
    }

    async listDevices() {
        return navigator.mediaDevices.enumerateDevices()
    }
}