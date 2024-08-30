const input = document.getElementById("selectAvatar");
const avatar = document.getElementById("avatar");
const textArea = document.getElementById("textArea");

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

const uploadImage = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    const cnv = document.getElementById("canvas");
    const ctx = cnv.getContext("2d");

    // avatar.src = base64;
    var img = base64.split(',')[1];
    fetch("http://127.0.0.1:5000/classe", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
        image:img,
    }),
    })  
    .then((response) => response.json())
    .then((json) => {
        const image = document.createElement("img");
        image.onload=function(){
            const imageWidth = image.width;
            const imageHeight = image.height;

            cnv.width = imageWidth;
            cnv.height = imageHeight;
            ctx.drawImage(image, 0, 0);

            json["objects"].forEach(element => {
                let xywh = element.xywh;
                xywh[0] -= xywh[2]/2;
                xywh[1] -= xywh[3]/2;
                
                ctx.lineWidth = "3";
                ctx.strokeStyle = "red";
                ctx.rect(xywh[0],xywh[1],xywh[2],xywh[3]);
                ctx.font = "20px Arial";
                ctx.fillStyle = "yellow";
                ctx.fillText(parseInt(element.conf*100) + "% - " + element.cls,xywh[0],xywh[1]-20);
                ctx.stroke();
            });
        }
        image.src = base64;
    });
};

input.addEventListener("change", (e) => {
    uploadImage(e);
});