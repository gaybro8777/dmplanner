Ext.define('DMPlanner.controller.Questions', {
    extend: 'Ext.app.Controller',

    //stores : [//
    //'Sections'//
    //],
    views: ['QuestionsForm', 'SectionList'],

    refs: [{
        ref: 'container',
        selector: '#sectionContainer'
    }, {
        ref: 'form',
        selector: 'questions'
    }, {
        ref: 'sections',
        selector: 'sectionlist'
    }],

    init: function(application) {
        this.control({
            sectionlist: {
                select: this.showSection
            },
            '#sectionNext' : {
                click : this.showNextSection
            },
            '#sectionPrev' : {
                click : this.showPrevSection
            },

             /*'#surveyFinish' : {
             click : this.finishSurvey
             },*/

             'questions field' : {
                change : this.saveItem
             }
        });

        /*this.listen({
         store : {
         '#Sections' : {
         baz : this.onStore
         }
         }
         });*/
    },

    showSection: function(grid, record, index) {
        //@format:off
        var groups = record.groups(),
            cont = this.getContainer(),
            bbar = cont.down('toolbar#bottomNavBar'),
            config = record.get('config'),
            count = grid.getStore().getCount(),
            isLastSection = (count - index) === 1,
            isFirstSection = (count - index) === count,
            buttons = [],
            questions;
        //@format:on

        cont.removeAll();
        bbar.removeAll();

        //check for config
        if (Ext.isObject(config)) {
            //form.setTitle(record.get('name') + ': config');
            //do config stuff, add xtype
            questions = {
                xtype: 'dmpkeywords',
                header: false
            };

        } else if (groups.count() > 0) {
            //create questions form
            questions = {
                xtype: 'questions',
                bodyPadding: 20,
                flex: 1,
                width: '100%',
                title: record.get('name'),
                items: this.getGroupQuestions(groups) //get an array of fieldsets
            };

        }

        if (!!questions) {
            cont.add(questions);
        }

        if(!isFirstSection){
            buttons.push({
                xtype : 'button',
                text : 'Previous',
                itemId : 'sectionPrev'
            });
        }

        buttons.push({
            xtype : 'button',
            text : isLastSection ? 'Save' : 'Next',
            itemId : isLastSection ? 'planFinish' : 'sectionNext'
        });

        bbar.add(buttons);

    },

    getGroupQuestions: function(groups) {
        var fieldsets = [];

        groups.each(function(group) {
            var fields = [];
            group.questions().each(function(question) {
                var info = question.get('guidance'),
                    field = Ext.apply({
                        fieldLabel: question.get('question'),
                        value: question.get('answer'),
                        question: question,
                        anchor: '100%',
                        xtype: 'textfield',
                        afterLabelTextTpl: !!info ? '<span class="fa dmp-icon-guidance sup" data-qtip="' + info + '">&#xf059;</span>' : undefined,
                        //afterSubTpl: !!info ? '<span class="dmp-icon-guidance" data-qtip="' + info + '">?</span>' : undefined,
                        //afterBodyEl: !!info ? '<span class="dmp-icon-guidance" data-qtip="' + info + '">?</span>' : undefined,
                        //msgTarget         : 'side',
                        labelAttrTpl: 'data-qtip="' + info + '"'
                    }, question.get('config'));

                fields.push(field);
            });
            fieldsets.push({
                xtype: 'fieldset',
                title: group.get('name'),
                items: fields,
                maxWidth: group.get('width') || 600,
                width: '100%'
            });
        });
        return fieldsets;
    },
     showNextSection: function() {
         var grid = this.getSections(),
             store = grid.getStore(),
             selModel = grid.getSelectionModel(),
             selected = selModel.getLastSelected(),
             curIndex = store.indexOf(selected),
             next = store.getAt(curIndex + 1);

         if (next) {
            selModel.select([next]);
         }
     },
     showPrevSection: function() {
         var grid = this.getSections(),
             store = grid.getStore(),
             selModel = grid.getSelectionModel(),
             selected = selModel.getLastSelected(),
             curIndex = store.indexOf(selected),
             prev = store.getAt(curIndex - 1);

         if (prev) {
            selModel.select([prev]);
         }
     },

     /*finishSurvey : function() {
     var groups = this.getGroups();
     this.getForm().removeAll();
     groups.getSelectionModel().deselectAll();
     groups.hide();
     groups.up().down('surveylist').getSelectionModel().deselectAll();

     },*/

    saveItem : function(field) {
        var question = field.question;

        if (!question) {
            field = field.up('[question]');
            question = field.question;
        }

        if (question) {
            question.set('answer', field.getValue());
        }
    }

});
