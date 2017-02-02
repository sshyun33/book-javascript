
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
        
        // step #03-03
        // 기존 선택메뉴 아이템이 있는 경우 선택처리
        objThis.reSelectMenuItem();
    
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
    
    
    //this.$overItem = $item;
    //this.$overItem.addClass("over");
    
    
    // step #03-02
    // 신규 오버 메뉴 아이템이 선택 메뉴 아이템과 같지 않은 경우에만 오버 메뉴 아이템 스타일 적용하기 
    // 주의! 
    // $item의 경우 mouseenter이벤트가 발생할때마다 $(this)에 의해서 인스턴스가 계속해서 만들이지기 때문에 
    // $selectItem == $item과 비교하면 안됨
    
    // 선택 메뉴 아이템 인덱스 값 구하기
    var selectIndex = -1;
    if(this.$selectItem!=null){
        selectIndex = this.$selectItem.index();
    }
            
    // 신규 오버메뉴 아이템의 인덱스 값과 선택 메뉴 아이템 인덱스 값을 비고        
    if($item.index()!=selectIndex){ 
       // 오버 효과 처리
       this.$overItem = $item;
       this.$overItem.addClass("over");
    }else {
        this.$overItem = null;
    }
    
    
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
BarMenu.prototype.moveBar=function($item, animation){
    
    var left = -100;
    var width = 0;
    if($item!=null) {
        left = $item.position(true).left+parseInt($item.css("margin-left"));
        width = $item.outerWidth();
    }
    /*
     // 애니메이션 이동
    this.$bar.stop().animate({
        "left":left,
        "width":width
    },300,"easeOutQuint");
     */
    if(animation==false){
        // 애니메이션 없이 바로 이동
        this.$bar.css({
            "left":left,
            "width":width
        });
    }else {
        // 애니메이션 이동
        this.$bar.stop().animate({
            "left":left,
            "width":width
        },300,"easeOutQuint");
    }
}


/*
 * step #03-01
 * 선택 메뉴 아이템 처리
 * $item : 선택 메뉴 아이템
 * 
 */
BarMenu.prototype.setSelectMenuItem=function($item, animation){
    // 선택 메뉴 아이템 스타일 처리
    if(this.$selectItem){
        this.$selectItem.removeClass("select");
    }
    this.$selectItem = $item;
    this.$selectItem.addClass("select");

    // 메뉴 바 이동
    this.moveBar($item, animation);
}




// step #03-03
// 기존 선택메뉴 아이템이 있는 경우 선택처리
BarMenu.prototype.reSelectMenuItem=function(){
    if(this.$selectItem){
        this.moveBar(this.$selectItem);
    }
}   


// step #03-03
// 기존 선택메뉴 아이템이 있는 경우 선택처리
BarMenu.prototype.reSelectMenuItem=function(){
    if(this.$selectItem){
        this.moveBar(this.$selectItem);
    }
}  


/* 
 * step #03-043
 * animation : 애니메이션 이동 여부
 */
BarMenu.prototype.setSelectMenuItemAt=function(index, animation){
    this.setSelectMenuItem(this.$menuItems.eq(index), animation);
}

