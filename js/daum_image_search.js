function search_image() {
    if(event.keyCode == 13) {
        //alert("검색시작")
        $.ajax({
            async : true,
            url : "https://dapi.kakao.com/v2/search/image",
            data : {
                query : $("#movie_name").val() + " 포스터",
                sort : "accuracy"
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Authorization",
                    "KakaoAK fa8fc647c0baa880c996d0c5d72be01b")
            },
            type : "GET",
            timeout : 3000,
            dataType : "json",
            //key = fa8fc647c0baa880c996d0c5d72be01b
            success : function (result) {
                //alert("성공")
                var image_list = result.documents
                var li = $("<li></li>")
                var img = $("<img />").attr("src", image_list[0].thumbnail_url)
                    .addClass("myImage")
                li.append(img)
                $("ul").append(li)
                //alert(image_list[0].thumbnail_url)
            },
            error : function (error) {
                alert("실패")
            }
        })
    }
}