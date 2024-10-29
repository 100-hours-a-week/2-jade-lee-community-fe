document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdown.addEventListener('click', function () {
        dropdownContent.classList.toggle('show'); // 드롭다운 메뉴 표시/숨김
    });

    // 드롭다운 외부 클릭 시 메뉴 닫기
    window.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});
