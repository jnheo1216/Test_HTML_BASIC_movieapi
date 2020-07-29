function call_ajax() {
    var search_date = $("input[type=date]").val()
    var search_date1 = search_date.replace(/-/gi, "")

    //입력텍스트 상자에서 키보드로 입력이 들어갔을 때 호출
    //모든 키가 아니라 엔터키 경우에만 처리되도록
    // if(event.keyCode == 13) {
        //AJAX콜을 이용해서 데이터를 받는 코드
        //ajax의 인자로 자바스크립트 객체를 넣어줘요 json
        // => 파이썬의 dict와 유사함
        // data : 서버프로그램에 넘겨줄 데이터들
        var url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=f0272902eed6c66da9aa5a2ed15847b3&targetDt="
        url += search_date1

        $.ajax({
            async : true, // 키값 정해져있음 // async : true => 비동기방식(default)
            url : url,
            //data : { targetDt : $("input[type=text]").val() },
            type : "GET",
            timeout : 30000,
            dataType : "json",  // 결과 json을 자동으로 객체로 변환 // 원래 json은 객체가 아니고 그냥 문자열ㅇ;ㅁ

            success : function(result) {
                //console.log(url);
                //alert("서버호출 성공")
                //console.log(result);
                //console.log(result.boxOfficeResult.dailyBoxOfficeList[0].movieNm);

                $("tbody").empty()

                var my_box_list = result.boxOfficeResult.dailyBoxOfficeList

                for (var i=0; i<result.boxOfficeResult.dailyBoxOfficeList.length;i++) {
                    var tr = $("<tr></tr>").attr('id', result.boxOfficeResult.dailyBoxOfficeList[i].movieCd)
                    var rankTd = $("<td></td>").text(result.boxOfficeResult.dailyBoxOfficeList[i].rank)
                    var imgTd = $("<td></td>")
                    // var imgname = result.boxOfficeResult.dailyBoxOfficeList[i].movieNm
                    // var img_url = search_image(imgname)
                    // var img = $("<img />").attr("src",img_url)
                    // imgTd.append(img)
                    var nameTd = $("<td></td>").text(result.boxOfficeResult.dailyBoxOfficeList[i].movieNm)
                    var salesTd = $("<td></td>").text(result.boxOfficeResult.dailyBoxOfficeList[i].salesAcc)
                    var audiTd = $("<td></td>").text(result.boxOfficeResult.dailyBoxOfficeList[i].audiAcc)
                    var moreTd = $("<td></td>")
                    var moreBtn = $("<input />").attr("type", "button").attr("value", "상세정보")

                    var cdtd = $("<td></td>").text(result.boxOfficeResult.dailyBoxOfficeList[i].movieCd)
                    //console.log(cdtd)
                    moreBtn.on("click", function () {
                        //console.log($(this).parent().parent().attr('id'))
                        get_detail($(this).parent().parent().attr('id'))
                    }) // 개쩐다 ㄷㄷ

                    var moviname = result.boxOfficeResult.dailyBoxOfficeList[i].movieNm
                    $.ajax({
                        async : false,
                        url : "https://dapi.kakao.com/v2/search/image",
                        data : {
                            query : moviname + " 공식 포스터",
                            sort : "accuracy"
                        },
                        beforeSend : function(xhr) {
                            xhr.setRequestHeader("Authorization",
                                "KakaoAK fa8fc647c0baa880c996d0c5d72be01b")
                        },
                        type : "GET",
                        timeout : 30000,
                        dataType : "json",
                        //key = fa8fc647c0baa880c996d0c5d72be01b
                        success : function (result) {
                            //alert("성공")
                            var image_list = result.documents
                            var img = $("<img />").attr("src", image_list[0].thumbnail_url)
                            imgTd.append(img)
                            //alert(image_list[0].thumbnail_url)
                        },
                        error : function (error) {
                            alert("실패")
                        }
                    })


                    moreTd.append(moreBtn)

                    tr.append(rankTd)
                    tr.append(imgTd)
                    tr.append(nameTd)
                    tr.append(salesTd) //만듬
                    tr.append(audiTd)
                    tr.append(moreTd)
                    $("tbody").append(tr) //붙여
                }

            }, // 성공하면 이거 해라
            error : function (error) {
                alert("서버호출 실패")
            } // 실패하면 이거 해라
        })
    // }

}

// function img_search() {
//     alert("이미지 소환중")
//     $.ajax({
//         async : true,
//         url : "https://apis.daum.net/contents/movie",
//         data : {q : result.boxOfficeResult.dailyBoxOfficeList[i].movieNm},
//         type : "GET",
//         timeout : 30000,
//     })
// }

function get_detail(moviecode) {
    var url_detail = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=f0272902eed6c66da9aa5a2ed15847b3&movieCd="
    url_detail += moviecode
    $.ajax({
        async : true, // 키값 정해져있음 // async : true => 비동기방식(default)
        url : url_detail,
        type : "GET",
        timeout : 30000,
        dataType : "json",  // 결과 json을 자동으로 객체로 변환 // 원래 json은 객체가 아니고 그냥 문자열ㅇ;ㅁ

        success : function(result) {
            var genres = " "
            var actors = " "
            var directors = " "
            genn = result.movieInfoResult.movieInfo.genres
            act = result.movieInfoResult.movieInfo.actors
            direc = result.movieInfoResult.movieInfo.directors
            $.each(genn, function (idx, item) {
                genres += item.genreNm
                genres += " "
            })
            $.each(act, function (idx, item) {
                actors += item.peopleNm
                actors += " "
            })
            $.each(direc, function (idx, item) {
                directors += item.peopleNm
                directors += " "
            })
            var movieinfo = [result.movieInfoResult.movieInfo.movieNm + "\n 개봉일 : " +
                result.movieInfoResult.movieInfo.openDt + "\n 장르 : " +
                genres + "\n 감독 : " +
                directors + "\n 출연배우 : " +
                actors]
            alert(movieinfo)
        },
        error : function (error) {
            alert("서버호출 실패")
        }

    })

}

function search_image(moviname) {
    var send_url = ""
    $.ajax({
        async : false,
        url : "https://dapi.kakao.com/v2/search/image",
        data : {
            query : moviname + " 공식 포스터",
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
            var image_list = result.documents
            send_url = image_list[0].thumbnail_url
            console.log(send_url)
            //alert(send_url)
        },
        error : function (error) {
            alert("실패")
        }
    })
    return send_url
}

