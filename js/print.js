const AJAX = {
    post: function (URL, data, callback) {
        const XMLreq = new XMLHttpRequest();
        XMLreq.onreadystatechange = function () {
            if (XMLreq.readyState === 4) {
                if (XMLreq.status === 200) {
                    callback(XMLreq.response);
                };
            };
        }
        XMLreq.responseType = "blob";
        XMLreq.timeout = 300000;
        XMLreq.open("POST", URL, true);
        XMLreq.send(data);
    },
    download: function (incomingData, MIMEtype, callback) {
        let a = document.createElement("a"),
            url, downloadFile = new Blob([incomingData], { type: MIMEtype });
        console.log(JSON.stringify(downloadFile.name));
        url = window.URL.createObjectURL(downloadFile);
        document.body.appendChild(a);
        a.href = url;
        a.download = `${getDecentlyFormattedDate()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        if (callback) callback();
    }
};
function getDecentlyFormattedDate() {
    const today = new Date();
    return `${today.getFullYear()}-${addZeros((today.getMonth()) + 1)}-${addZeros(today.getDate())}_${addZeros(today.getHours())}-${addZeros(today.getMinutes())}-${addZeros(today.getSeconds())}`;
    function addZeros(inp) {
        return ("0" + inp).slice(-2);
    }
}
(function () {
    window.addEventListener("load", function () {
        const formPost = document.getElementById("form_post");
        const buttonPost = document.getElementById("button_post");
        const inputResolution = document.getElementById("resolution");
        const sliderResolution = document.getElementById("slider-resolution");
        document.getElementById("button_post");
        formPost.addEventListener("submit", function (element) {
            element.preventDefault();
            const formData = new FormData(formPost);
            AJAX.post("scan.php", formData, function (resp) {
                AJAX.download(resp, "application/pdf", function () {
                    buttonPost.removeAttribute("disabled");
                    buttonPost.value = "Scan";
                });
            });
            buttonPost.setAttribute("disabled", true);
            buttonPost.value = "Please wait";
        });
        inputResolution.addEventListener("keyup", function () {
            if (inputResolution.validity.valid && inputResolution.value !== "") {
                sliderResolution.MaterialSlider.change(inputResolution.value);
            }
        });
        sliderResolution.addEventListener("input", function () {
            inputResolution.value = sliderResolution.value;
        });

    });
})();
