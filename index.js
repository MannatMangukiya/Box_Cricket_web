async function loginHandler() {
    const Http = new XMLHttpRequest();
    const url = 'localhost:3000/login';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.readyState === XMLHttpRequest.DONE) {
            if (Http.status === 200) {
                // Response received successfully
                const responseHtml = Http.responseText;
                // Update the DOM to display the response HTML
                document.getElementById("loginPageContent").innerHTML = responseHtml;
            } else {
                // Handle error if any
                console.error("Error fetching login page:", Http.statusText);
            }
        }
    }
}