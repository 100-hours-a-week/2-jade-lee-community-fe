document.addEventListener("DOMContentLoaded", function() {
    const createPostButton = document.querySelector('.create-post-button');

    createPostButton.addEventListener('click', function() {
        // boardWrite 페이지로 이동
        window.location.href = '/boardWrite'; // 또는 원하는 경로로 변경
    });
});
// 게시글로 이동
document.getElementById("post1").addEventListener("click", function() {
    window.location.href = "boardDetail"; // 원하는 경로로 이동
});
document.addEventListener("DOMContentLoaded", function () {
    const profileImg = document.querySelector('.profile-img');
    const dropdownContent = document.querySelector('.dropdown-content');

    // 프로필 이미지 클릭 시 드롭다운 표시
    profileImg.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });

    // 드롭다운 외부 클릭 시 숨기기
    window.addEventListener('click', function (event) {
        if (!profileImg.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});
