function curKeywords() {
    let keywords = $("#searchContent").val();
    keywords = keywords.replace(/\s*/g, "");
    keywords = keywords.toLowerCase();
    return keywords;
}


$("#checkButton").click(function () {
    // window.location.href = "dashboard.html";
    keywords = curKeywords();
    if (keywords !== "") {
        if (keywords === "datascience") {
            window.location.href = "dashboard.html" + "?course=" + keywords;
        }
        else {
            alert("No such course!");
        }
    } else {
        alert("Please input keywords!");
    }
});

$("#importButton").click(function () {
})