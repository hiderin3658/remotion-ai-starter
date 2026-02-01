const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const textToSpeech = require('@google-cloud/text-to-speech');

async function generateTTS() {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../video-config.json'), 'utf8'));
    const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/news-data.json'), 'utf8'));
    const audioDir = path.join(__dirname, '../public/audio');

    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    console.log(`Using TTS Provider: ${config.tts.provider}`);
    console.log(`Gender: ${config.tts.gender}`);

    const durations = [];

    for (const item of newsData) {
        const outputPath = path.join(audioDir, `${item.id}.mp3`);
        console.log(`Generating audio for ${item.id}...`);

        if (config.tts.provider === 'gcp' || config.tts.provider === 'gemini') {
            await generateGCP(item.text, outputPath, config.tts.gender, config.tts.gcpCredentialsPath);
        } else {
            await generateSystem(item.text, outputPath);
        }

        // Measure duration
        const duration = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`).toString().trim();
        durations.push({ id: item.id, duration: parseFloat(duration) });
    }

    fs.writeFileSync(path.join(__dirname, '../src/durations.json'), JSON.stringify(durations, null, 2));
    console.log('Audio generation and duration measurement complete.');
}

async function generateGCP(text, outputPath, gender, credentialsPath) {
    const client = new textToSpeech.TextToSpeechClient({
        keyFilename: path.resolve(__dirname, '..', credentialsPath),
    });

    // 日本語の高品質なボイスを選択
    const voiceName = (gender === 'male') ? 'ja-JP-Neural2-C' : 'ja-JP-Neural2-B';

    const request = {
        input: { text: text },
        voice: {
            languageCode: 'ja-JP',
            name: voiceName,
        },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
}

async function generateSystem(text, outputPath) {
    const aiffPath = outputPath.replace('.mp3', '.aiff');
    execSync(`say -v Kyoko "${text}" -o "${aiffPath}"`);
    execSync(`ffmpeg -y -i "${aiffPath}" "${outputPath}"`);
    fs.unlinkSync(aiffPath);
}

generateTTS().catch(console.error);
