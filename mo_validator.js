console.log('js is working');
const errorMessage = document.querySelector(".form-group[data-group-id='middleName']");
console.log(errorMessage.dataset.groupId);

setTimeout( function(){
  errorMessage.classList.add('error');
}, 2000);

class MoValidator {
  validGroups = {}; // and array of groups that pass validation
  invalidGroups = {}; // an array of groups that fail validation
  groupClasses = {}; // each form group has it's own class. All classes are stored here
  config; // the form configuration
  formGroups; // An array of all form group HTML elements
  form; // the form HTML element itself


  constructor(form, formConfig){
    this.form = form;
    this.config = formConfig;
    this.formGroups = form.querySelectorAll('.form-group');

    // loop through all form groups in the form
    this.formGroups.forEach( formGroup => {

      // loop through keys in the form config array
      for(let inputName in this.config){
        /*
         if a form group data-group-id matches a config key,
         and the input type is text
         data-attribute is automatically changed to camel case group-id == groupId
         */
        if(formGroup.dataset.groupId === inputName && this.config[inputName].type === 'text'){
          // create a new instance of the class associated with text fields

        }
      }
    })
  }

  Input = class{
    valid = null; // - could be true, false or null (null is default)
    value = null; // - could be true, false or null (null is default)
    config; // config of the particular input

    constructor(formGroup, config){
      // check if form-group and config is passed in
      if(formGroup && config){
        this.config = config; // the config for a single group
        this.name = config.name; // the name of the field (used in displaying error message)
        this.formGroup = formGroup; // the form group element

        /**
         * Set the value of this.input to the input tag inside the form-group element
         * @type {any | Element}
         */
        this.input = formGroup.getElementsByTagName(`${this.config.tag}`)[0];

        this.addBlur(); // validate the input when it is deselected
        this.addFocus(); // remove error in the input when user focuses on it
      }
    }

    /**
     * ADDS FUNCTIONALITY TO VALIDATE AN INPUT IMMEDIATELY USER MOUSES AWAY
     * adds a blur event listener to the group input
     * when an input is de-selected, the input inside is validated
     */
    addBlur() {
      // using arrow function to retain the scope of (this)
      this.input.addEventListener('blur', e =>{
        // validate field
        this.validate();
      })
    }

    /**
     * ADDS FUNCTIONALITY TO REMOVE ERRORS WHEN INPUT IS SELECTED
     * adds a focus event listener to the group input
     * when an input is selected, any error inside it is removes
     */
    addFocus() {
      // using arrow function to retain the scope of (this)
      this.input.addEventListener('focus', e =>{
        // remove error class on the form-group and error span inside the form group
        this.removeError();
      })
    }

    // checks each input value against it's configuration
    validate(){
      // change the group validity and value to null
      this.resetValues();

      // if this input is required or something is inside, it has to be validated
      if(this.config.required || this.input.value.trim().length > 0){
        // if empty: display error
        if(this.isEmpty() === true ){
          this.setAsInvalid();
          this.displayError(`${this.name} is required`);
        }
      }
    }

    // Reset the group validity and  value to null
    resetValues(){
      this.valid = null;
      this.value = null;
    }

    /**
     * CHECKS IF THE INPUT  VALUE IS EMPTY
     * @returns {boolean}
     */
    isEmpty(){
      return this.input.value.trim() === '';
    }

    /**
     * CHECKS IF THE INPUT VALUE IS LONGER THAN THE MAX SPECIFIED IN CONFIG
     * @returns {boolean}
     */
    isLong(){
      return this.input.value.trim().length > this.config.max;
    }

    /**
     * CHECKS IF THE INPUT VALUE IS SHORTER THAN THE MIN SPECIFIED IN CONFIG
     * @returns {boolean}
     */
    isShort(){
      return this.input.value.trim().length < this.config.min;
    }

    // sets the form group value to something and the validity to (true)
    setAsValid(){
      this.value = this.input.value.trim();
      this.valid = true;
    }

    /**
     * CHECKS IF THE INPUT VALUE MATCHES THE REGULAR EXPRESSION IN THE CONFIG
     * @returns {boolean}
     */
    matchPattern(){
      // if field had regEx check & return else return true
      return this.config.regEx ? this.input.value.search(this.config.regEx) >= 0 : true;
    }


  };

  TextInput = class TextInput extends this.Input{

  }
}