
function BarMenu(selector){
    // step #02-02
    // 프로퍼티 생성하기 
    this.$barMenu = null;
    this.$menuBody= null;
    this.$menuItems  = null;
    this.$overItem = null;
    this.$bar = null;
    
    // step #03-01
    // 선택 메뉴 아이템
    this.$selectItem = null;
    
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
    
    // step #02-03
    // 메뉴 영역을 나간 경우
    this.$barMenu.mouseleave(function(e){
        // 기존 오버메뉴 아이템이 있는 경우 제거
        objThis.removeOverItem();
    
    })
    
    // step #03-01
    // 선택 메뉴 아이템 처리
    this.$menuItems.click(function(e){
        // 기존 오버메뉴 아이템이 있는 경우 제거
        objThis.removeOverItem();
        // 선택 메뉴 아이템 처리
        objThis.setSelectMenuItem($(this));
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
    
    // step #02-04
    // 메뉴 바 이동
    this.moveBar($item);
}


// step #02-03
// 오버 메뉴 아이템 제거
BarMenu.prototype.removeOverItem=function(){
    if(this.$overItem){
        this.$overItem.removeClass("over");
    }   
    this.$overItem = null;
    
    // step #02-04      
    this.moveBar(null); 
}

/*
 * step #02-04
 * $item : 이동 메뉴 아이템
 */
BarMenu.prototype.moveBar=function($item){
    
    var left = -100;
    var width = 0;
    if($item!=null) {
        left = $item.position(true).left+parseInt($item.css("margin-left"));
        width = $item.outerWidth();
    }
    
    // 애니메이션 이동
    this.$bar.stop().animate({
        "left":left,
        "width":width
    },300,"easeOutQuint");
}


/*
 * step #03-01
 * 선택 메뉴 아이템 처리
 * $item : 선택 메뉴 아이템
 * 
 */
BarMenu.prototype.setSelectMenuItem=function($item){
    // 선택 메뉴 아이템 스타일 처리
    if(this.$selectItem){
        this.$selectItem.removeClass("select");
    }
    this.$selectItem = $item;
    this.$selectItem.addClass("select");

    // 메뉴 바 이동
    this.moveBar($item);
}

