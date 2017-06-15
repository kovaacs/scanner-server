const AJAX = {
    getBlob: function (URL, callback) {
        const XMLreq = new XMLHttpRequest();
        XMLreq.onreadystatechange = function () {
            if (XMLreq.readyState === 4) {
                if (XMLreq.status === 200) {
                    callback(XMLreq.response);
                };
            };
        };
        XMLreq.responseType = "blob";
        XMLreq.open("GET", URL, true);
        XMLreq.send();
    },
    post: function (URL, data, callback) {
        const XMLreq = new XMLHttpRequest();
        XMLreq.onreadystatechange = function () {
            if (XMLreq.readyState === 4) {
                if (XMLreq.status === 200) {
                    callback(XMLreq.responseText);
                };
            };
        }
        XMLreq.timeout = 300000;
        XMLreq.open("POST", URL, true);
        XMLreq.send(data);
    },
    download: function (inBlob, fileName, MIMEtype, callback) {
        let a = document.createElement("a"),
            url;
        inBlob.type = MIMEtype;
        url = window.URL.createObjectURL(inBlob);
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        if (callback) callback();
    }
};
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
                const parsedJSON = JSON.parse(resp);
                AJAX.getBlob(parsedJSON.file_name, function (resp) {
                    AJAX.download(resp, parsedJSON.file_name.split("/")[1], "application/pdf", function () {
                        buttonPost.removeAttribute("disabled");
                        buttonPost.value = "Scan";
                    });
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
