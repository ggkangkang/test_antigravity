import { ref } from 'vue';

// Global state for audio player
const audioRef = ref(null);
const isPlaying = ref(false);
const currentUrl = ref(null);

export function useAudioPlayer() {
    const togglePlay = async () => {
        if (!audioRef.value) return;

        if (isPlaying.value) {
            audioRef.value.pause();
            isPlaying.value = false;
        } else {
            try {
                await audioRef.value.play();
                isPlaying.value = true;
            } catch (e) {
                console.error("Toggle play failed:", e);
                isPlaying.value = false;
            }
        }
    };

    const play = async () => {
        if (!audioRef.value) return;
        try {
            await audioRef.value.play();
            isPlaying.value = true;
        } catch (e) {
            console.error("Play failed:", e);
            isPlaying.value = false;
        }
    };

    const pause = () => {
        if (!audioRef.value) return;
        audioRef.value.pause();
        isPlaying.value = false;
    };

    const setTrack = async (url) => {
        if (!audioRef.value || !url) return;

        // Only change src if it's different to avoid reloading
        if (audioRef.value.src !== url) {
            audioRef.value.src = url;
            currentUrl.value = url;
            // Attempt to play new track
            await play();
        } else {
            // If same track, just ensure it's playing
            if (!isPlaying.value) {
                await play();
            }
        }
    };

    return {
        audioRef,
        isPlaying,
        currentUrl,
        togglePlay,
        play,
        pause,
        setTrack
    };
}
