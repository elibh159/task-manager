import React from "react";
import Enzyme, { mount} from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import AssemblyLine from "../components/AssemblyLine";

Enzyme.configure({ adapter: new Adapter() });

describe("AssemblyLine", () => {
  let wrapper;
  
  beforeEach(() => {
    const stages = ["Idea", "Development", "Testing", "Deployment"];
    wrapper = mount(<AssemblyLine stages={stages} />);
  });
  afterEach(() => wrapper.unmount());

  describe("the correct elements were rendered", () => {
    it("should have an element with an '.assembly-add-item' class", () => {
      expect(wrapper.exists(".assembly-add-item")).toBe(true);
      expect(wrapper.find(".assembly-add-item").hostNodes()).toHaveLength(1);
    });
    
    it("should have 4 elements with the '.assembly-stage' class", () => {
      expect(wrapper.exists(".assembly-stage")).toBe(true);
      expect(wrapper.find(".assembly-stage").hostNodes()).toHaveLength(4);
    });
    
    it("should have 0 elements with the '.assembly-item' class initially", () => {
      expect(wrapper.exists(".assembly-item")).toBe(false);
      expect(wrapper.find(".assembly-item").hostNodes()).toHaveLength(0);
    });
  });
  
  describe("adding assembly items", () => {
    describe('when "goldenrod" is typed into ".assembly-add-item"', () => {
      let input;
      
      beforeEach(() => {
        input = wrapper.find(".assembly-add-item").hostNodes();
        input.simulate("change", { target: { value: "goldenrod" } });
      });
      
      it('should display entered text inside of ".assembly-add-item"', () => {
        expect(input.instance().value).toEqual("goldenrod");
      });
      
      describe('when enter key is pressed on ".assembly-add-item"', () => {
        beforeEach(() => {
          input.simulate("keydown", { 
            key: "Enter",  
            type: "keydown",
            which: 13,
            keyCode: 13,
          });
        });

        it('should respond to Enter keydown, clearing the input on ".assembly-add-item"', () => {
          const addItem = wrapper.find(".assembly-add-item").hostNodes();
          expect(addItem.instance().value).toEqual("");
        });

        it('should have a single item in the first stage after Enter on ".assembly-add-item"', () => {
          const item = wrapper.find(".assembly-stage").hostNodes()
            .at(0)
            .find(".assembly-item").hostNodes()
          ;
          expect(item.exists()).toBe(true);
          expect(item).toHaveLength(1);
          expect(item.text()).toEqual("goldenrod");
        });      
      }); 
    });
  });
  
  describe('moving assembly items', () => {
    describe('with 4 items initially added to Idea stage', () => {
      const startItems = [
        "indigo",
        "turquoise",
        "magenta",
        "fuschia"
      ];
      
      const stages = () => wrapper.find(".assembly-stage").hostNodes()
      const getStage = stageIndex => 
        stages().at(stageIndex).find('.assembly-item').hostNodes()
      ;
      
      beforeEach(() => {
        startItems.forEach((e, i) => {
          const input = wrapper.find(".assembly-add-item").hostNodes();
          input.simulate("change", { target: { value: e } });
          input.simulate("keydown", { 
            key: "Enter",  
            type: "keydown",
            which: 13,
            keyCode: 13,
          });      
        });       
      });
      
      it('items should initially be listed within Idea stage', () => {
        expect(getStage(0)).toHaveLength(4);
      });
      
      it('items should have been inserted in Idea stage in the correct order', () => {
        for (let i = 0; i < 4; i++) {
          expect(getStage(0).at(i).text()).toEqual(startItems[3-i]);
        }
      });
      
      describe('after first item in Idea stage is clicked', () => {
        beforeEach(() => getStage(0).at(0).simulate('click'));
        
        it('should prepend first item to the Development stage', () => {
          expect(getStage(0)).toHaveLength(3);
          expect(getStage(1)).toHaveLength(1);
          expect(getStage(0).at(0).text()).toEqual("magenta");
          expect(getStage(0).at(1).text()).toEqual("turquoise");
          expect(getStage(0).at(2).text()).toEqual("indigo");
          expect(getStage(1).at(0).text()).toEqual("fuschia");
        });
        
        describe('after the last item in the Idea stage is clicked', () => {
          beforeEach(() => getStage(0).at(2).simulate('click'));
           
          it('should prepend last item to the Development stage', () => {
            expect(getStage(0)).toHaveLength(2);
            expect(getStage(1)).toHaveLength(2);
            expect(getStage(0).at(0).text()).toEqual("magenta");
            expect(getStage(0).at(1).text()).toEqual("turquoise");
            expect(getStage(1).at(0).text()).toEqual("indigo");
            expect(getStage(1).at(1).text()).toEqual("fuschia");
          });
          
          describe('adding another item mid-stream', () => {
            beforeEach(() => {
              const input = wrapper.find(".assembly-add-item").hostNodes();
              input.simulate("change", { target: { value: "maroon" } });
              input.simulate("keydown", { 
                key: "Enter",  
                type: "keydown",
                which: 13,
                keyCode: 13,
              });
            });
           
            it('should prepend new item to the Idea stage', () => {
              expect(getStage(0)).toHaveLength(3);
              expect(getStage(1)).toHaveLength(2);
              expect(getStage(0).at(0).text()).toEqual("maroon");
              expect(getStage(0).at(1).text()).toEqual("magenta");
              expect(getStage(0).at(2).text()).toEqual("turquoise");
              expect(getStage(1).at(0).text()).toEqual("indigo");
              expect(getStage(1).at(1).text()).toEqual("fuschia");
            });
          
            describe('moving middle item from Idea to Development', () => {
              beforeEach(() => getStage(0).at(1).simulate('click'));
             
              it('should have length 2 in Idea and 3 in Development', () => {
                expect(getStage(0)).toHaveLength(2);
                expect(getStage(1)).toHaveLength(3);
                expect(getStage(0).at(0).text()).toEqual("maroon");
                expect(getStage(0).at(1).text()).toEqual("turquoise");
                expect(getStage(1).at(0).text()).toEqual("magenta");
                expect(getStage(1).at(1).text()).toEqual("indigo");
                expect(getStage(1).at(2).text()).toEqual("fuschia");
              });
          
              describe('moving middle item from Development to Idea', () => {
                beforeEach(() => getStage(1).at(1).simulate('contextmenu'));
               
                it('should have three in Idea and two in Development', () => {
                  expect(getStage(0)).toHaveLength(3);
                  expect(getStage(1)).toHaveLength(2);
                  expect(getStage(0).at(0).text()).toEqual("maroon");
                  expect(getStage(0).at(1).text()).toEqual("turquoise");
                  expect(getStage(0).at(2).text()).toEqual("indigo");
                  expect(getStage(1).at(0).text()).toEqual("magenta");
                  expect(getStage(1).at(1).text()).toEqual("fuschia");
                });
          
                describe('moving items from Development to Testing', () => {
                  beforeEach(() => {
                    getStage(1).at(0).simulate('click');
                    getStage(1).at(0).simulate('click');
                  });
                 
                  it('should leave Development empty and Testing with two', () => {
                    expect(getStage(0)).toHaveLength(3);
                    expect(getStage(1)).toHaveLength(0);
                    expect(getStage(2)).toHaveLength(2);
                    expect(getStage(0).at(0).text()).toEqual("maroon");
                    expect(getStage(0).at(1).text()).toEqual("turquoise");
                    expect(getStage(0).at(2).text()).toEqual("indigo");
                    expect(getStage(2).at(0).text()).toEqual("fuschia");
                    expect(getStage(2).at(1).text()).toEqual("magenta");
                  });
          
                  describe('moving an item from Testing to Production', () => {
                    beforeEach(() => getStage(2).at(1).simulate('click'));
                    
                    it('should leave one item in both Testing and Production', () => {
                      expect(getStage(0)).toHaveLength(3);
                      expect(getStage(1)).toHaveLength(0);
                      expect(getStage(2)).toHaveLength(1);
                      expect(getStage(3)).toHaveLength(1);
                      expect(getStage(0).at(0).text()).toEqual("maroon");
                      expect(getStage(0).at(1).text()).toEqual("turquoise");
                      expect(getStage(0).at(2).text()).toEqual("indigo");
                      expect(getStage(2).at(0).text()).toEqual("fuschia");
                      expect(getStage(3).at(0).text()).toEqual("magenta");
                    });
                    
                    describe('moving an item backwards from Testing to Development', () => {
                      beforeEach(() => getStage(2).at(0).simulate('contextmenu'));
                     
                      it('should leave one item in both Testing and Production', () => {
                        expect(getStage(0)).toHaveLength(3);
                        expect(getStage(1)).toHaveLength(1);
                        expect(getStage(2)).toHaveLength(0);
                        expect(getStage(3)).toHaveLength(1);
                        expect(getStage(0).at(0).text()).toEqual("maroon");
                        expect(getStage(0).at(1).text()).toEqual("turquoise");
                        expect(getStage(0).at(2).text()).toEqual("indigo");
                        expect(getStage(1).at(0).text()).toEqual("fuschia");
                        expect(getStage(3).at(0).text()).toEqual("magenta");
                      });
                    
                      describe('clear the rest of the list out', () => {
                        beforeEach(() => {
                          getStage(0).at(2).simulate('contextmenu');
                          getStage(1).at(0).simulate('contextmenu');
                          getStage(0).at(1).simulate('contextmenu');
                          getStage(3).at(0).simulate('click');
                          getStage(0).at(1).simulate('contextmenu');
                          getStage(0).at(0).simulate('contextmenu');
                        });
                       
                        it('should be empty', () => {
                          expect(getStage(0)).toHaveLength(0);
                          expect(getStage(1)).toHaveLength(0);
                          expect(getStage(2)).toHaveLength(0);
                          expect(getStage(3)).toHaveLength(0);
                        });
                      });
                    });
                   
                    describe('removing an item from Idea', () => {
                      beforeEach(() => getStage(0).at(1).simulate('contextmenu'));
                     
                      it('should leave one item in Testing', () => {
                        expect(getStage(0)).toHaveLength(2);
                        expect(getStage(1)).toHaveLength(0);
                        expect(getStage(2)).toHaveLength(1);
                        expect(getStage(0).at(0).text()).toEqual("maroon");
                        expect(getStage(0).at(1).text()).toEqual("indigo");
                        expect(getStage(2).at(0).text()).toEqual("fuschia");
                      });
                    });
                   
                    describe('removing an item from Production', () => {
                      beforeEach(() => getStage(3).at(0).simulate('click'));
                     
                      it('should clear Production', () => {
                        expect(getStage(0)).toHaveLength(3);
                        expect(getStage(1)).toHaveLength(0);
                        expect(getStage(2)).toHaveLength(1);
                        expect(getStage(3)).toHaveLength(0);
                        expect(getStage(0).at(0).text()).toEqual("maroon");
                        expect(getStage(0).at(1).text()).toEqual("turquoise");
                        expect(getStage(0).at(2).text()).toEqual("indigo");
                        expect(getStage(2).at(0).text()).toEqual("fuschia");
                      });
                    });
                  });
                });
              });
            });
          });
        });
        
        describe('after the item within Development stage is contextually clicked', () => {
          beforeEach(() => getStage(1).at(0).simulate('contextmenu'));
          
          it('should have moved that item back to the Idea stage', () => {
            expect(getStage(0)).toHaveLength(4);
            expect(getStage(1)).toHaveLength(0);
            expect(getStage(2)).toHaveLength(0);
            expect(getStage(0).at(0).text()).toEqual("magenta");
            expect(getStage(0).at(1).text()).toEqual("turquoise");
            expect(getStage(0).at(2).text()).toEqual("indigo");
            expect(getStage(0).at(3).text()).toEqual("fuschia");
          });
        });
        
        describe('after the item within Development stage is clicked', () => {
          beforeEach(() => getStage(1).at(0).simulate('click'));
          
          it('should have moved that item to the Testing stage', () => {
            expect(getStage(0)).toHaveLength(3);
            expect(getStage(1)).toHaveLength(0);
            expect(getStage(2)).toHaveLength(1);
            expect(getStage(0).at(0).text()).toEqual("magenta");
            expect(getStage(0).at(1).text()).toEqual("turquoise");
            expect(getStage(0).at(2).text()).toEqual("indigo");
            expect(getStage(2).at(0).text()).toEqual("fuschia");
          });
          
          describe('after the item within Testing stage is clicked', () => {
            beforeEach(() => getStage(2).at(0).simulate('click'));
            
            it('should have moved that item to the Testing stage', () => {
              expect(getStage(0)).toHaveLength(3);
              expect(getStage(1)).toHaveLength(0);
              expect(getStage(2)).toHaveLength(0);
              expect(getStage(3)).toHaveLength(1);
              expect(getStage(0).at(0).text()).toEqual("magenta");
              expect(getStage(0).at(1).text()).toEqual("turquoise");
              expect(getStage(0).at(2).text()).toEqual("indigo");
              expect(getStage(3).at(0).text()).toEqual("fuschia");
            });
            
            describe('after the item within Deployment stage is clicked', () => {
              beforeEach(() => getStage(3).at(0).simulate('click'));
              
              it('should have removed that item from the board', () => {
                expect(getStage(0)).toHaveLength(3);
                expect(getStage(1)).toHaveLength(0);
                expect(getStage(2)).toHaveLength(0);
                expect(getStage(3)).toHaveLength(0);
                expect(getStage(0).at(0).text()).toEqual("magenta");
                expect(getStage(0).at(1).text()).toEqual("turquoise");
                expect(getStage(0).at(2).text()).toEqual("indigo");
              });
            });
          }); 
        });        
      });
      
      describe('after first item within Idea stage is contextually clicked', () => {
        beforeEach(() => getStage(0).at(0).simulate('contextmenu'));
        
        it('should have removed that item from the Idea stage', () => {
          expect(getStage(0)).toHaveLength(3);
          expect(getStage(1)).toHaveLength(0);
          expect(getStage(0).at(0).text()).toEqual("magenta");
          expect(getStage(0).at(1).text()).toEqual("turquoise");
          expect(getStage(0).at(2).text()).toEqual("indigo");
        });
      });
    });
  });
});
