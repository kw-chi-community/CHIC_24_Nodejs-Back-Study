// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // 별점 기능
    const stars = document.querySelectorAll('.star');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            rating = star.getAttribute('data-value'); // 별점의 데이터 값 가져오기

            // 클릭한 별점까지 활성화
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= rating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });

    // 저장 버튼 클릭 이벤트
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', () => {
        const reviewText = document.getElementById('review').value;
        console.log(`Saved Review: ${reviewText}, Rating: ${rating}`);
        alert('Review saved!');
    });

    // 마이페이지로 이동 버튼 클릭 이벤트
    const goToMypageButton = document.getElementById('goToMypage');
    goToMypageButton.addEventListener('click', () => {
        window.location.href = '/mypage'; // 마이페이지로 이동
    });
});
