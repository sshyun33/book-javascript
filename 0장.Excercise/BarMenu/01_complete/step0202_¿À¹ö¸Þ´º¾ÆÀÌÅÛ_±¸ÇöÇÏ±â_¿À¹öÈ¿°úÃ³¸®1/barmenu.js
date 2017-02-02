
function BarMenu(selector){
    // step #02-02
    // 프로퍼티 생성하기 
    this.$barMenu = null;
    this.$menuBody= null;
    this.$menuItems  = null;
    this.$overItem = null;
    this.$bar = null;
    
    this.init(selector);
    this.initEvent();   
}


// 요소 초기화 
BarMenu.prototype.init=function(selector){
    // step #02-02
    this.$barMenu = $(selector);
    this.$menuBody = this.$barMenu.find(".menu-body");
    this.$menuItems = this.$menuBody.find("li");
    this.$bar = this.$barMenu.find(".bar");
}


// 이벤트 초기화 
BarMenu.prototype.initEvent=function(){
    // step #02-02
    var objThis = this;
    
    // 오버 메뉴 효과 처리
    this.$menuItems.mouseenter(function(e){
        objThis.setOverMenuItem($(this));
    })  
}

// step #02-02
/*
* 오버 메뉴 아이템 처리 하기
* $item : 신규 오버 메뉴 아이템
*/
BarMenu.prototype.setOverMenuItem=function($item){
    // 기존 오버메뉴 아이템에서 over 스타일 제거
    if(this.$overItem){
        this.$overItem.removeClass("over");
    }   
    
    this.$overItem = $item;
    this.$overItem.addClass("over");

}
