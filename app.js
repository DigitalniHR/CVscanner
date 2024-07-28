document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('zivotopis-soubor');
    const fileNameDisplay = document.getElementById('nazev-souboru');
    const scanButton = document.getElementById('skenovat-zivotopis');
    const countdownSection = document.getElementById('odpocet');
    const countdownText = document.getElementById('odpocet-text');
    const countdownCircle = document.getElementById('odpocet-kruh');
    const resultsSection = document.getElementById('vysledky');
    const chatgptResponse = document.getElementById('chatgpt-odpoved');
    const newScanButton = document.getElementById('novy-sken');

    fileInput.addEventListener('change', updateFileName);
    scanButton.addEventListener('click', startScan);
    newScanButton.addEventListener('click', resetScan);

    function updateFileName() {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = `Vybraný soubor: ${fileInput.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }
    }

    function startScan() {
        const resume = document.getElementById('zivotopis').value;
        const jobTitle = document.getElementById('nazev-pozice').value;
        const industry = document.getElementById('obor').value;
        const jobDescription = document.getElementById('popis-prace').value;

        if (!resume && !fileInput.files.length) {
            alert('Prosím nahrajte soubor životopisu nebo vložte text životopisu.');
            return;
        }
        if (!jobDescription) {
            alert('Prosím vyplňte popis práce.');
            return;
        }

        document.getElementById('vstup').classList.add('skryto');
        document.getElementById('akce').classList.add('skryto');
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
        const resume = document.getElementById('zivotopis').value;
        const jobTitle = document.getElementById('nazev-pozice').value;
        const industry = document.getElementById('obor').value;
        const jobDescription = document.getElementById('popis-prace').value;

        const webhookUrl = 'https://hook.eu1.make.com/dnnp3fa33rodu212ydpkhmrrvm9yntph';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resume: resume,
                    jobTitle: jobTitle,
                    industry: industry,
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
        document.getElementById('zivotopis').value = '';
        document.getElementById('nazev-pozice').value = '';
        document.getElementById('obor').value = '';
        document.getElementById('popis-prace').value = '';
        fileInput.value = '';
        fileNameDisplay.textContent = '';

        resultsSection.classList.add('skryto');
        document.getElementById('vstup').classList.remove('skryto');
        document.getElementById('akce').classList.remove('skryto');
    }
});
