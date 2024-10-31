document.addEventListener("DOMContentLoaded", function () {
    const profileImg = document.querySelector('.profile-img');
    const dropdownContent = document.querySelector('.dropdown-content');

    profileImg?.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropdownContent?.classList.toggle('show');
    });

    window.addEventListener('click', function (event) {
        if (!profileImg.contains(event.target)) {
            dropdownContent?.classList.remove('show');
        }
    });
});
