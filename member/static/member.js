(function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define('/tables/datatable', ['jquery', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
      factory(require('jquery'), require('Site'));
    } else {
      var mod = {
        exports: {}
      };
      factory(global.jQuery, global.Site);
      global.tablesDatatable = mod.exports;
    }
  })(this, function (_jquery, _Site) {
    'use strict';
  
    var _jquery2 = babelHelpers.interopRequireDefault(_jquery);
  
    (0, _jquery2.default)(document).ready(function ($$$1) {
      (0, _Site.run)();
    });
  
    // Table Add Row
    // -------------
    (function ($$$1) {
      var EditableTable = {
  
        options: {
          addButton: '#addToTable',
          table: '#exampleAddRow',
          dialog: {
            wrapper: '#dialog',
            cancelButton: '#dialogCancel',
            confirmButton: '#dialogConfirm'
          }
        },
  
        initialize: function initialize() {
          this.setVars().build().events();
        },
  
        setVars: function setVars() {
          this.$table = $$$1(this.options.table);
          this.$addButton = $$$1(this.options.addButton);
  
          // dialog
          this.dialog = {};
          this.dialog.$wrapper = $$$1(this.options.dialog.wrapper);
          this.dialog.$cancel = $$$1(this.options.dialog.cancelButton);
          this.dialog.$confirm = $$$1(this.options.dialog.confirmButton);
  
          return this;
        },
  
        build: function build() {
          this.datatable = this.$table.DataTable({
            aoColumns: [{
            }, null, null, {
              "bSortable": false
            }],
            language: {
              "sSearchPlaceholder": "Search..",
              "lengthMenu": "_MENU_",
              "search": "_INPUT_"
            }
          });
  
          window.dt = this.datatable;
  
          return this;
        },
  
        events: function events() {
          var _self = this;
  
          this.$table.on('click', 'a.save-row', function (e) {
            e.preventDefault();
  
            _self.rowSave($$$1(this).closest('tr'));
          }).on('click', 'a.cancel-row', function (e) {
            e.preventDefault();
  
            _self.rowCancel($$$1(this).closest('tr'));
          }).on('click', 'a.edit-row', function (e) {
            e.preventDefault();
  
            _self.rowEdit($$$1(this).closest('tr'));
          }).on('click', 'a.remove-row', function (e) {
            e.preventDefault();
  
            var $row = $$$1(this).closest('tr');
            bootbox.dialog({
              message: "Are you sure that you want to delete this row?",
              title: "ARE YOU SURE?",
              buttons: {
                danger: {
                  label: "Confirm",
                  className: "btn-danger",
                  callback: function callback() {
                    _self.rowRemove($row);
                  }
                },
                main: {
                  label: "Cancel",
                  className: "btn-primary",
                  callback: function callback() {}
                }
              }
            });
          });
  
          this.$addButton.on('click', function (e) {
            e.preventDefault();
  
            _self.rowAdd();
          });
  
          this.dialog.$cancel.on('click', function (e) {
            e.preventDefault();
            $$$1.magnificPopup.close();
          });
  
          return this;
        },
  
        // =============
        // ROW FUNCTIONS
        // =============
        rowAdd: function rowAdd() {
          this.$addButton.attr({
            'disabled': 'disabled'
          });
  
          var actions, data, $row;
  
          actions = ['<a href="#" class="btn btn-sm btn-icon btn-pure btn-default on-editing save-row" data-toggle="tooltip" data-original-title="Save" hidden><i class="icon md-wrench" aria-hidden="true"></i></a>', '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default on-editing cancel-row" data-toggle="tooltip" data-original-title="Delete" hidden><i class="icon md-close" aria-hidden="true"></i></a>', '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default on-default edit-row" data-toggle="tooltip" data-original-title="Edit"><i class="icon md-edit" aria-hidden="true"></i></a>', '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default on-default remove-row" data-toggle="tooltip" data-original-title="Remove"><i class="icon md-delete" aria-hidden="true"></i></a>'].join(' ');
  
          data = this.datatable.row.add(['', '', '', actions]);
          $row = this.datatable.row(data[0]).nodes().to$();
  
          $row.addClass('adding').find('td:last').addClass('actions');
  
          this.rowEdit($row);
  
          this.datatable.order([0, 'asc']).draw(); // always show fields
        },
  
        rowCancel: function rowCancel($row) {
          var _self = this,
              $actions,
              i,
              data,
              $cancel;
  
          if ($row.hasClass('adding')) {
            this.rowRemove($row);
          } else {
            $actions = $row.find('td.actions');
            $cancel = $actions.find('.cancel-row');
            $cancel.tooltip('hide');
  
            if ($actions.get(0)) {
              this.rowSetActionsDefault($row);
            }
  
            data = this.datatable.row($row.get(0)).data();
            this.datatable.row($row.get(0)).data(data);
  
            this.handleTooltip($row);
  
            this.datatable.draw();
          }
        },
  
        rowEdit: function rowEdit($row) {
          var _self = this,
              data;
  
          data = this.datatable.row($row.get(0)).data();
  
          $row.children('td').each(function (i) {
            var $this = $$$1(this);
  
            if ($this.hasClass('actions')) {
              _self.rowSetActionsEditing($row);
            } else if (i == 1) {
              $this.html('<input type="email" class="form-control input-block" value="' + data[i] + '"/>');
            } else if (i == 2) {
              $this.html('<select class="form-control"><option value="1">1</option><option value="2">2</option></select>');
              if (!$row.hasClass('adding')) {
                $this.find('option[value='+data[i]+']').attr('selected', 'selected');
              }
            }
          });
        },
  
        rowSave: function rowSave($row) {
          var _self = this,
              $actions,
              values = [],
              $save;
  
          values = $row.find('td').map(function (i) {
            var $this = $$$1(this);
  
            if ($this.hasClass('actions')) {
              _self.rowSetActionsDefault($row);
              return _self.datatable.cell(this).data();
            } else if (i == 0) {
              return _self.datatable.cell(this).data();
            } else {
              return $$$1.trim($this.find('select, input').val());
            }
          });
  
          $.ajax({
            url: $row.hasClass('adding') ? base_url : base_url + values[0], 
            method: $row.hasClass('adding') ? 'POST' : 'PUT',
            data: {
              name: values[1],
              group: values[2],
            },
            success: function(data, textStatus, jQxhr) {
  
              if (data.success) {
                values[0] = data.id;
    
                if ($row.hasClass('adding')) {
                  _self.$addButton.removeAttr('disabled');
                  $row.removeClass('adding');
                }
        
                $actions = $row.find('td.actions');
                $save = $actions.find('.save-row');
                $save.tooltip('hide');
        
                if ($actions.get(0)) {
                  _self.rowSetActionsDefault($row);
                }
        
                _self.datatable.row($row.get(0)).data(values);
                _self.handleTooltip($row);
        
                _self.datatable.draw();
              } else {
                console.log(data.err);
              }
            },
            error: function(jqXhr, textStatus, errorThrown) {
              console.log(errorThrown)
            }
          });
        },
  
        rowRemove: function rowRemove($row) {
          var _self = this;
  
          if ($row.hasClass('adding')) {
            this.$addButton.removeAttr('disabled');
          }
  
          $.ajax({
            url: base_url + this.datatable.row($row.get(0)).data()[0], 
            method: 'DELETE',
            success: function(data, textStatus, jQxhr) {
              if (data.success) {
                _self.datatable.row($row.get(0)).remove().draw();
              } else {
                console.log(data.err);
              }
            },
            error: function(jqXhr, textStatus, errorThrown) {
              console.log(errorThrown)
            }
          });
        },
  
        rowSetActionsEditing: function rowSetActionsEditing($row) {
          $row.find('.on-editing').removeAttr('hidden');
          $row.find('.on-default').attr('hidden', true);
        },
  
        rowSetActionsDefault: function rowSetActionsDefault($row) {
          $row.find('.on-editing').attr('hidden', true);
          $row.find('.on-default').removeAttr('hidden');
        },
        handleTooltip: function handleTooltip($row) {
          var $tooltip = $row.find('[data-toggle="tooltip"]');
          $tooltip.tooltip();
        }
  
      };
  
      $$$1(function () {
        EditableTable.initialize();
      });
    }).apply(undefined, [jQuery]);
  });