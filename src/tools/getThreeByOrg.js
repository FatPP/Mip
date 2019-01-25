function three(data, option = {}) {
    this.json = [];
    this.dataSource = data;
    this.children = option.children;
    this.selected = option.selected;
    this.getRootMenu();
    // debugger;
    console.log(this.json);
    if (option.root) {
      this.json = [{
        "expand": true,
        "title": "/",
        children: this.json
      }]
    }
    for (var m of this.json) {
      this.pushNode(m.orgId, m);
    }
    !!option.sort && this.sort(this.json);
  }
  
  three.prototype.getRootMenu = function () {
    for (var m of this.dataSource) {
      m.selected = this.selected && this.selected.indexOf(m.orgId) >= 0 ? true : false;
      m.checked = this.children && this.children.indexOf(m.orgId) >= 0 ? true : false;
      m.expand = true;
      if (m.parentId=="0") {
        this.json.push(Object.assign({}, m, {
          title: m.promptName,
          children: []
        }))
      }
    }
  }
  
  three.prototype.pushNode = function (id, node) {
    for (var m of this.dataSource) {
      if (m.parentId == id) {
        node.children = !node.children ? [] : node.children;
        node.children.push(Object.assign({}, m, {
          title: m.promptName,
          children: []
        }))
        this.pushNode(node.children[node.children.length - 1].orgId, node.children[node.children.length - 1]);
      }
    }
  }
  
  three.prototype.sort = function (list) {
    list = list.sort(function (a, b) {
      return a.orgNameAbbr.localeCompare(b.orgNameAbbr,"zh");
    })
    for (var node of list) {
      if (!!node.children && node.children.length > 0) {
        this.sort(node.children);
      }
    }
  }
  
  export default three