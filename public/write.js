document.addEventListener("DOMContentLoaded", () => {
  let rating = 0;

  // 별점 클릭 이벤트
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      rating = star.getAttribute("data-value"); // 선택된 별점 값을 저장

      // 선택한 별점까지만 활성화
      stars.forEach((s) => {
        if (s.getAttribute("data-value") <= rating) {
          s.classList.add("selected");
        } else {
          s.classList.remove("selected");
        }
      });
    });
  });

  // 저장 버튼 클릭 이벤트
  const saveButton = document.getElementById("save");
  saveButton.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const reviewText = document.getElementById("review").value;
    const photoInput = document.getElementById("photo");
    const photoFile = photoInput.files[0]; // 업로드된 사진 파일

    // 유효성 검사: 제목, 리뷰 텍스트, 별점이 있는지 확인
    if (!title || !reviewText || !rating) {
      alert("제목, 리뷰를 작성하고 별점을 선택해주세요.");
      return;
    }

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", reviewText);
    formData.append("rating", rating);
    if (photoFile) {
      formData.append("photo", photoFile); // 사진 파일이 있으면 추가
    }

    // 서버로 데이터 전송 (AJAX 요청)
    fetch("/api/records", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰 저장 중 오류 발생");
        }
        return response.json();
      })
      .then((data) => {
        alert("리뷰가 성공적으로 저장되었습니다!");
        window.location.href = "/records.html"; // 기록 페이지로 이동
      })
      .catch((error) => {
        console.error("리뷰 저장 중 오류 발생:", error);
        alert("리뷰 저장에 실패했습니다.");
      });
  });

  // 마이페이지로 이동 버튼 클릭 이벤트
  const goToMypageButton = document.getElementById("goToMypage");
  goToMypageButton.addEventListener("click", () => {
    window.location.href = "/mypage.html"; // 마이페이지로 이동
  });
});
