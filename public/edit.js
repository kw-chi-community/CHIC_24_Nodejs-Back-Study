document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-form");
  const titleInput = document.getElementById("title");
  const imageInput = document.getElementById("image");
  const contentTextarea = document.getElementById("content");
  const imagePreview = document.getElementById("image-preview");
  const backButton = document.getElementById("back-btn");

  // URL에서 게시글 ID를 가져옴
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const recordId = parseInt(urlParams.get("id"), 10);

  // 서버에서 게시글 데이터를 가져옴
  fetch(`/api/records/${recordId}`)
    .then((response) => response.json())
    .then((record) => {
      // 폼에 기존 데이터 로딩
      titleInput.value = record.title;
      contentTextarea.value = record.content;
      imagePreview.src = record.image;
      imagePreview.style.display = 'block';
    })
    .catch((error) => {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    });

  // 이미지 업로드 시 미리보기 표시
  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // 폼 제출 시 데이터 전송
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);

    fetch(`/api/records/${recordId}`, {
      method: "PUT",
      body: formData, // FormData를 서버로 전송
    })
      .then((response) => response.json())
      .then((updatedRecord) => {
        alert("게시글이 수정되었습니다.");
        window.location.href = `view.html?id=${recordId}`; // 수정 후 게시글 보기 페이지로 이동
      })
      .catch((error) => {
        console.error("게시글 수정 중 오류 발생:", error);
      });
  });

  // 뒤로 가기 버튼 클릭 시 이전 페이지로 돌아가기
  backButton.addEventListener("click", () => {
    window.history.back(); // 브라우저의 이전 페이지로 이동
  });
});
