document.addEventListener("DOMContentLoaded", function() {
    const createPostButton = document.querySelector('.create-post-button');

    createPostButton.addEventListener('click', function() {
        // boardWrite 페이지로 이동
        window.location.href = '/boardWrite'; // 또는 원하는 경로로 변경
    });
});
// 게시글로 이동
document.getElementById("post1").addEventListener("click", function() {
    window.location.href = "boardDetail"; 
});
document.addEventListener("DOMContentLoaded", function () {
    const profileImg = document.querySelector('.profile-img');
    const dropdownContent = document.querySelector('.dropdown-content');

    profileImg.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });

    window.addEventListener('click', function (event) {
        if (!profileImg.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});
