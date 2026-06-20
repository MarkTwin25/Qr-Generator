const input = document.getElementById("text-input");
const generateBtn = document.getElementById("generate-btn");
const inputDiv = document.querySelector(".input");

const colorPicker = document.getElementById("color");
const bgColorPicker = document.getElementById("bg-color");

const qrImg = document.querySelector(".qr-img");


const downloadBtn = document.getElementById("download");
const copyBtn = document.getElementById("copy");
const cleanBtn = document.getElementById("clean");

async function createQrCode(content, color, bgColor){

    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${content}&size=100x1000&color=${color}&bgcolor=${bgColor}`
    const req = await fetch(url);
    const data = await req.blob();

    // Create URL
    const imageUrl = URL.createObjectURL(data);

    // Create container and image
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const img = document.createElement("img");
    img.id = "qr-code";
    img.src = imageUrl

    imgContainer.appendChild(img);

    // First clean the 
    qrImg.textContent = "";

    // Append img to DOM
    qrImg.appendChild(imgContainer);

}

function showError(message){
    input.style.borderBottom = "2px solid red";
    
    // Create p tag

    const p = document.createElement("p");
    p.textContent = message;
    p.classList.add("error");

    inputDiv.appendChild(p);
}

function cleanErrorIfExists(){
    const error = document.querySelector(".error");

    if(error){
        error.remove();
    }
}


// Events
generateBtn.addEventListener("click", async() => {
    const content = input.value;
    const primaryColor = colorPicker.value;
    const secondaryColor = bgColorPicker.value;

    cleanErrorIfExists();

    if(content == ""){
        showError("sdadas");
        return
    }
    input.style.borderBottom = "none";

    await createQrCode(content, primaryColor.slice(1, primaryColor.lenght), secondaryColor.slice(1, secondaryColor.lenght));
})

cleanBtn.addEventListener("click", () => {
    input.value = "";
    qrImg.textContent = "";
    colorPicker.value = "#00000";
    bgColorPicker.value = "#ffffff";
})

downloadBtn.addEventListener("click", async() => {
    const img = document.getElementById("qr-code");

    cleanErrorIfExists();
    
    if(!img){
        showError("You should generate a Qr code first.");
        return
    }

    const imgUrl = img.src;

    try {
        const req = await fetch(imgUrl);

        const blob = await req.blob();
        const urlLocal = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlLocal;
        link.download = 'qr.png';

        document.body.appendChild(link);
        link.click();
        
        // clean
        document.body.removeChild(link);
        URL.revokeObjectURL(urlLocal);
    } catch (error) {
        showError("There was a problem.");
    }
});

copyBtn.addEventListener("click", async() =>{
    const img = document.getElementById("qr-code");

    cleanErrorIfExists();

    if (!img) {
        showError("You should generate a Qr code first.")
        return;
    }

    const imgUrl = img.src;

    try {
        const req = await fetch(imgUrl);
        const blob = await req.blob();

        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);

        // Feedback visual para el usuario
        alert("¡Código QR copiado al portapapeles!");

    } catch (error) {
        showError("There was a problem.");
    }
})