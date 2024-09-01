document.addEventListener("DOMContentLoaded", function () {
  // 게시글 컨테이너를 가져옴
  const postContainer = document.getElementById("post-container");
  
  // URL에서 게시글 ID를 가져옴
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const recordId = parseInt(urlParams.get("id"), 10);
  
  // 서버에서 게시글 데이터를 가져옴
  fetch(`/api/records/${recordId}`)
    .then((response) => response.json())
    .then((record) => {
      // 게시글 내용 요소 생성
      const postTitle = document.createElement("h2");
      postTitle.textContent = record.title;

      const postImage = document.createElement("img");
      postImage.src = record.image;
      postImage.alt = "Post Image";
      postImage.className = "post-image";

      const postContent = document.createElement("p");
      postContent.textContent = record.content;
      
      // 뒤로 가기 버튼 클릭 시 이전 페이지로 돌아가기
      const backBtn = document.getElementById("back");
      backBtn.addEventListener("click", () => {
        window.history.back(); // 브라우저의 이전 페이지로 이동
      });

      // 게시글 요소를 페이지에 추가
      postContainer.appendChild(postTitle);
      postContainer.appendChild(postImage);
      postContainer.appendChild(postContent);
    })
    .catch((error) => {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    });
});
