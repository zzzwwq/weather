let citys;
$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
    success:function(e){
        citys=e.data;
        let str="";
        for(key in citys){
            str+=`<h2>${key}</h2>`;
            str+=`<div class="con">`;
            for (key2 in citys[key]){
                str+=`<div class="city">${key2}</div>`;
            }
            str+=`</div>`;
        }
        $(str).appendTo($(".cityBox"));
    }
})

$(function(){
    $(".audioBtn").click(function(e){
        e.stopPropagation();
        let speech=window.speechSynthesis;
        let speechset=new SpeechSynthesisUtterance();
        let text=$(".header span").text()+"当前温度为"+$("#tem").text()+"度"+"空气质量为"+$("#x").text();
        speechset.text=text;
        speech.speak(speechset);
    })


    let cityBox=$(".cityBox");
    $(".header").click(function(){
            cityBox.slideDown();
    })
    $(".cityBox button").click(function(){
        cityBox.slideUp();
    })
    cityBox.on("touchstart",function(event){
        if (event.target.className=="city"){
            let city=event.target.innerText;
            $.ajax({
                url:"https://www.toutiao.com/stream/widget/local_weather/data/",
                data:{'city':city},
                type:"get",
                dataType:"jsonp",
                success:function(e){
                    console.log(e);
                    updata(e.data);
                }
            })
            cityBox.slideUp();
        }
    })
})
function updata(data){
    $(".header span").text(data.city);
    $("#s").text(data.weather.aqi);
    $("#x").text(data.weather.quality_level);
    $("#tem").text(data.weather.current_temperature);
    $("#cloud").text(data.weather.current_condition);
    $("#wind").text(data.weather.wind_direction+data.weather.dat_weather_icon_id+"级");
    $("#day_tem").text(data.weather.dat_high_temperature+"/"+data.weather.dat_low_temperature);
    $("#d").text(data.weather.day_condition);
    $(".today img").attr("src",`img/${data.weather.dat_weather_icon_id}.png`);
    $("#tom_tem").text(data.weather.tomorrow_high_temperature+"/"+data.weather.tomorrow_low_temperature);
    $("#m").text(data.weather.tomorrow_condition);
    $(".tomorrow img").attr("src",`img/${data.weather.dat_weather_icon_id}.png`);
    $(".box").each(function(i){
        $(".box .time").eq(i).text(data.weather.hourly_forecast[`${i}`].hour);
        $(".box .tem1").eq(i).text(data.weather.hourly_forecast[`${i}`].temperature);
        $(".box img").eq(i).attr("src",`img/${data.weather.hourly_forecast[`${i}`].weather_icon_id}.png`);
    })
    let str1="";
    let x=[];
    let height=[];
    let low=[];
    let weeknum=["日","一","二","三","四","五","六"];
    for(obj of data.weather.forecast_list){
        let date=new Date(obj.date);
        let day=date.getDay();
        x.push(obj.data);
        height.push(obj.high_temperature);
        low.push(obj.low_temperature);
        str1+=`
                <div class="box1">
                    <div><span class="week">星期${weeknum[day]}</span></div>
                    <div><span class="date">${obj.date}</span></div>
                    <div  class="moreY"><span>${obj.high_temperature}°</span></div>
                    <img src="img/${obj.weather_icon_id}.png" alt="">
                    <div class="kong"></div>
                    <img src="img/${obj.weather_icon_id}.png" alt="">
                    <div><span>${obj.low_temperature}°</span></div>
                    <div class="moreY"><span>${obj.wind_direction}</span></div>
                    <div><span>${obj.wind_level}级</span></div>
                </div>
        `
// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init($(".chart")[0]);

        // 指定图表的配置项和数据
        var option = {

            xAxis: {
                data: x,
                show: false,
            },
            yAxis: {
                show: false,
            },
            series: [{
                type: 'line',
                data: height,
            },{
                type: 'line',
                data: low,
            }],
            grid:{
                left: 0,
                right: 0,
                bottom: 0,
                top: '30%',
                tooltip: {
                    show: false,
                },
            },
            borderColor:{
                show: false,
            }
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
    $(".weeks .con1").html(str1);
    // 基于准备好的dom，初始化echarts实例
}
$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/data/",
    data:{'city':'太原'},
    type:"get",
    dataType:"jsonp",
    success:function(e){
        console.log(e);
        updata(e.data);
    }
})
