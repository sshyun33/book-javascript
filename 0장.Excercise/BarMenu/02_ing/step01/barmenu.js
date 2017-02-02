function BarMenu(selector) {
  this.$barMenu = null;
  this.$menuBody = null;
  this.$menuItems = null;
  this.$overItem = null;
  this.$bar = null;

  this.init(selector);
  this.initEvent();
}

BarMenu.prototype.init = function (selector) {
  this.$barMenu = $(selector);
  this.$menuBody = this.$barMenu.find(".menu-body");
  this.$menuItems = this.$menuBody.find("li");
  this.$bar = this.$barMenu.find(".bar");
};

BarMenu.prototype.initEvent = function () {
  var objThis = this;

  this.$menuItems.mouseenter(function (e) {
    objThis.setOverMenuItem($(this));
  })
};

BarMenu.prototype.setOverMenuItem = function ($item) {
  if (this.$overItem) {
    this.$overItem.removeClass("over");
  }

  this.$overItem = $item;
  this.$overItem.addClass("over");
};
