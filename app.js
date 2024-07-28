document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('zivotopis-soubor');
    const resumeTextarea = document.getElementById('zivotopis');
    const jobTitleInput = document.getElementById('nazev-pozice');
    const jobDescriptionTextarea = document.getElementById('popis-prace');
    const scanButton = document.getElementById('skenovat-zivotopis');
    const countdownSection = document.getElementById('odpocet');
    const countdownText = document.getElementById('odpocet-text');
    const countdownCircle = document.getElementById('odpocet-kruh');
    const resultsSection = document.getElementById('vysledky');
    const chatgptResponse = document.getElementById('chatgpt-odpoved');
    const newScanButton = document.getElementById('novy-sken');

    const resumeError = document.getElementById('zivotopis-error');
    const jobError = document.getElementById('prace-error');

    scanButton.addEventListener('click', startScan);
    newScanButton.addEventListener('click', resetScan);

    function startScan() {
        const resumeFile = fileInput.files[0];
        const resumeText = resumeTextarea.value.trim();
        const jobTitle = jobTitleInput.value.trim();
        const jobDescription = jobDescriptionTextarea.value.trim();
        
        resumeError.style.display = 'none';
        jobError.style.display = 'none';
        
        if (!resumeFile && !resumeText) {
            resumeError.style.display = 'block';
            return;
        }
        
        if (!jobTitle || !jobDescription) {
            jobError.style.display = 'block';
            return;
        }

        document.querySelector('.input-section').classList.add('skryto');
        scanButton.classList.add('skryto');
        countdownSection.classList.remove('skryto');

        startCountdown();
    }

    function startCountdown() {
        let timeLeft = 60;
        const totalTime = 60;
        const circumference = 2 * Math.PI * 90;

        const timer = setInterval(() => {
            timeLeft--;
            countdownText.textContent = timeLeft;

            const offset = circumference - (timeLeft / totalTime) * circumference;
            countdownCircle.style.strokeDashoffset = offset;

            if (timeLeft <= 0) {
                clearInterval(timer);
                callWebhook();
            }
        }, 1000);
    }

    async function callWebhook() {
        const resumeText = resumeTextarea.value.trim();
        const jobTitle = jobTitleInput.value.trim();
        const jobDescription = jobDescriptionTextarea.value.trim();

        const webhookUrl = 'https://hook.eu1.make.com/dnnp3fa33rodu212ydpkhmrrvm9yntph';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resume: resumeText,
                    jobTitle: jobTitle,
                    jobDescription: jobDescription
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showResults(data.analysis);
        } catch (error) {
            console.error('Error:', error);
            showResults('Omlouváme se, při analýze došlo k chybě. Zkuste to prosím znovu později.');
        }
    }

    function showResults(analysis) {
        countdownSection.classList.add('skryto');
        resultsSection.classList.remove('skryto');
        chatgptResponse.textContent = analysis;
    }

    function resetScan() {
        fileInput.value = '';
        resumeTextarea.value = '';
        jobTitleInput.value = '';
        jobDescriptionTextarea.value = '';

        resultsSection.classList.add('skryto');
        document.querySelector('.input-section').classList.remove('skryto');
        scanButton.classList.remove('skryto');
    }
});
