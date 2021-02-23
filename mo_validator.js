// console.log('js is working');
// const errorMessage = document.querySelector(".form-group[data-group-id='middleName']");
// console.log(errorMessage.dataset.groupId);
//
// setTimeout( function(){
//   errorMessage.classList.add('error');
// }, 2000);

class MoValidator {
  validGroups = {}; // and array of groups that pass validation
  invalidGroups = {}; // an array of groups that fail validation
  groupClasses = []; // each form group has it's own class. All classes are stored here
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
          const classInstance = new this.TextInput(formGroup, this.config[inputName]);
          this.addFormGroup(classInstance); //store the initialized class in an array
        }
  
        if(formGroup.dataset.groupId === inputName && this.config[inputName].type === 'select'){
          // create a new instance of the class associated with text fields
          const classInstance = new this.TextInput(formGroup, this.config[inputName]);
          this.addFormGroup(classInstance); // store the initialized class in an array
        }
      }
    })
  }

  /**
   * checks for invalid fields using getInvalidGroups();
   * checks if the invalid fields array is empty.
   * @returns {boolean} true if there are no invalid fields false if there are invalid fields
   */
  isValid(){
    /**
     * reset valid and invalid fields array
     * check all group validity and refill valid and invalid fields array appropriately
     */
    this.getInvalidGroups();
    // check if invalidFields array is empty if so, return false
    // we can also check if the number of valid fields matches that in the form config
    for (let key in this.invalidGroups){
      if(this.invalidGroups.hasOwnProperty(key)){
        return false;
      }
    }
    return true;
  }

  /**
   * ADDS A FORM GROUPS THAT IS VALID TO THE validFields ARRAY
   * @param {string} fieldName - name of the valid field
   * @param {string} fieldValue - the valid field's value
   */
  addToValidGroups(fieldName, fieldValue){
    this.validGroups[fieldName] = fieldValue;
  }

  /**
   * ADDS A FORM GROUPS THAT IS INVALID TO THE invalidFields ARRAY
   * @param {string} fieldName - name of the invalid field
   * @param {string} fieldValue - the value of the invalid field
   */
  addToInvalidGroups(fieldName, fieldValue){
    this.invalidGroups[fieldName] = fieldValue;
  }


  /**
   * GETS ALL THE INVALID FIELDS IN THE FORM
   * Empties the valid  and invalid inputs array
   * loops through stored classes(groupClasses)
   * collects the valid and invalid input values from all stored classes
   * puts valid fields in validFields array
   * puts invalid fields in invalidFields array
   * @returns {object} a list of valid fields and their values
   */
  getValidGroups(){
    this.validGroups = {}; // empty valid fields for refill
    this.invalidGroups = {}; // empty invalid fields array for refill
    this.groupClasses.forEach( (field) => {
      // add a validated value to the values object array
      return field.valid ? this.addToValidGroups(field.formGroup.dataset.groupId, field.value) : this.addToInvalidGroups(field.formGroup.dataset.groupId, field.value);
    });
    return this.validGroups;
  }

  /**
   * RETURNS AN ARRAY OF INVALID FIELDS IN THE FORM
   * Empties the valid  and invalid inputs array
   * loops through stored classes(groupClasses)
   * collects the valid and invalid input values from all stored classes
   * puts valid fields in validFields array
   * puts invalid fields in invalidFields array
   * @returns {object} a list of invalid fields and their values
   */
  getInvalidGroups(){
    this.validGroups = {}; // empty valid fields for refill
    this.invalidGroups = {}; // empty invalid fields array for refill
    /**
     * loop through all fields to check their value and validity
     * if valid == true add the field details to the #valid fields array
     * if valid == false add the field details to the #invalid fields array
     */
    this.groupClasses.forEach( (field) => {
      return field.valid ? this.addToValidGroups(field.formGroup.dataset.groupId, field.value) : this.addToInvalidGroups(field.formGroup.dataset.groupId, field.value);
    });
    return this.invalidGroups;
  }

  /**
   * ADDS AN INITIALIZED CLASS TO AN ARRAY OF INITIALIZED CLASSES
   * takes in an instance of a class and stores it in an array
   * classes are stored so that data validated class.value can be pulled from them
   * @param {object} classInstance - an instance of a class
   */
  addFormGroup(classInstance){
    this.groupClasses.push(classInstance);
  }

  /**
   * RUN THE VALIDATE FUNCTION FOR ALL FIELDS
   * loops through each form group and run's their validate function
   * @returns {boolean}
   */
  validate(){
    this.groupClasses.forEach( (formGroup) =>{
      formGroup.validate();
    });
    // check the invalidFields array to see that it is empty
    return this.isValid();
  }

  /**
   * ADDS AN ERROR CLASS TO THE FORMS BUTTON + SCROLLS TO THE FIRST ERROR
   */
  errorAction(){
    const submitButton =  this.form.getElementsByTagName('button')[0];
    // add error class to the button
    // this changes the button background
    submitButton.classList.add('error');

    setTimeout( ()=>{
      this.scrollErrorToView();
    }, 1700);

    // remove error class after two seconds
    // returns the button to it's original color
    setTimeout( ()=>{
      submitButton.classList.remove('error');
    }, 2000);
  }

  /**
   * SCROLLS THE USER'S VIEW TO THE FIRST ERROR FIELD IN THE FORM
   * field: array key in invalidFields array
   * group: the first form group with an invalid field
   */
  scrollErrorToView(){
    // loop through keys in invalidGroups array
    for(let fieldName in this.invalidGroups){
      const group = document.querySelector(`.form-group[data-group-id='${fieldName}'`); // get the form group with the error in it
      group.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}); // scroll the form group into view
      if (fieldName === fieldName) break; // stop loop at the first iteration we only need the first form group found
    }
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
        this.displayName = config.displayName;
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
          this.displayError(`${this.displayName} is required`);
        }

        // if too short: display error
        else if(this.config.min && this.isShort() === true ){
          this.setAsInvalid();
          this.displayError(`${this.displayName} is too short`);
        }

        // if too long: display error
        else if(this.config.max && this.isLong() === true ){
          this.setAsInvalid();
          this.displayError(`${this.displayName} is too long`);
        }

        // if does not match pattern
        else if(this.matchPattern() === false ){
          this.setAsInvalid();
          this.displayError(`${this.displayName} does not match the required pattern`);
        }

        // only alphabets
        else if( ( this.config.rules && this.config.rules.includes('only-alphabets') ) && this.input.value.trim().search(new RegExp('[^a-zA-Z ]')) >= 0 ){
          this.setAsInvalid();
          this.displayError(`${this.displayName} can only contain alphabets`);
        }

        // set field as valid if all conditions above passed
        else {this.setAsValid()}
      }

      // if field is not required and the field is empty, set fields as valid
      // The code only gets here when HTMLForm.validate() is called
      /*
        this is because this function is only called when the user blurs away from the input
        if the user does not blur away from the input, the input will not be set as valid;
       */
      else if(this.config.required === false && this.input.value.trim().length < 1){
        this.setAsValid();
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

    // sets the form group value to something and the validity to (false)
    setAsInvalid(){
      this.value = this.input.value.trim();
      this.valid = false;
    }

    /**
     * CHECKS IF THE INPUT VALUE MATCHES THE REGULAR EXPRESSION IN THE CONFIG
     * @returns {boolean}
     */
    matchPattern(){
      // if field had regEx check & return else return true
      return this.config.regEx ? this.input.value.search(this.config.regEx) >= 0 : true;
    }

    /**
     *  CREATES A SPAN ELEMENT WITH A CLASS OF .FORM_ERROR
     * @param message - the error message that will be displayed in the form
     * @returns {HTMLElement} - the element in which the message is contained
     */
    createErrorMessage(message){
      const newSpan = document.createElement('span'); // create a span element
      newSpan.classList.add('error-message'); // give it a error-message class
      const newContent = document.createTextNode(message); // put the message inside the element
      newSpan.appendChild(newContent); // add the text node to the newly created span
      return newSpan; // <span class="error-message"> error message</span>
    }

    /**
     * REMOVES ERROR CLASS FROM A FROM GROUP AND THE ERROR MESSAGE SPAN
     */
    removeError(){
      this.formGroup.classList.remove('error');
      /*
      Allow 3 seconds to animate out the message element before
      removing it from the DOM
       */
      setTimeout( () =>{
        this.removeErrorMessage();
      },300);
    }

    /**
     * INSERTS A SPAN ELEMENT WITH AN ERROR MESSAGE INTO THE FORM GROUP
     * @param message -
     */
    displayError(message){
      this.removeErrorMessage(); // remove any error message before creating a new one
      const errorSpan = this.createErrorMessage(message); // create the span element and put the message inside it
      // insert the span element at the end of the form group
      this.formGroup.insertAdjacentElement('beforeend', errorSpan); // add the span element to the end of the form grou
      /*
      Add the error class after two seconds to allow animation
      animation will not work if the span element and error class is added at
      the same time
        the error message is only visible when the form group has an error class
        the error class animates in the error span
       */
      setTimeout( () =>{
        this.formGroup.classList.add('error');
      }, 300)
    }

    // Finds and removes error message element d
    removeErrorMessage(){
      // check if the form field has an error
      // remove error if exists, do nothing if not
      try{
        const errorMessage = this.formGroup.querySelector('.error-message');
        errorMessage.remove();
      }catch (e) {
        // do nothing
      }
    }

  };

  TextInput = class TextInput extends this.Input{
    constructor(formGroup, config){
      super(formGroup, config); // call the parent constructor with new parameters
    }
  };
  
  SelectInput = class SelectInput extends this.Input{
    constructor(formGroup, config){
      super(formGroup, config); // call the parent constructor with new parameters
    }
  };
}