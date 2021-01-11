# Mo Validator

Mo Validator is a simple and easy to use front-end form validator 

## Usage
using Mo Validator is quite simple and can be dont in just 3 steps

#### 1. Create HTML form

```html
<form class="form" id="profile-form">

    <div data-group-id="firstName" class="form-group">
        <label class="input-label">First name
            <input class="form-input" name="firstName" type="text" value="" autocomplete="off">
        </label>
    </div> <!-- Name -->

    <div data-group-id="middleName" class="form-group">
        <label class="input-label">Middle name
            <input class="form-input" name="middleName" type="text" value="" autocomplete="off">
        </label>
    </div> <!-- middle name -->

    <button class="" type="submit">Submit</button>

</form>
```
- follow HTML structure 
- all form groups must have a data-group-id that matches its input name

#### 2. Create a Javascript validation configuration object
```javascript
const validationConfig = {
      firstName: {
        name: 'firstName',
        displayName: 'first name',
        tag: 'input',
        type: 'text',
        required: true,
        rules: ['only-alphabets'],
      },
      middleName: {
        name: 'middleName',
        displayName: 'first name',
        tag: 'input',
        type: 'text',
        required: false,
        rules: ['only-alphabets'],
      },
    };
```
- Each config object name must match the data-group-id and input name
- All properties in a config object is required except 'rules'
- The display name is used to refer to an input field if it has an error

#### 3. Pass the form and the validation configuration into an instance of Mo Validator class
```javascript
// the form html 
const form = document.getElementById('profile-form');

// instantiate Mo Validator and pass in the form and config
const ProfileForm = new MoValidator(form, validationConfig);
```

Once step 3 is done, your form is automatically listening for inputs. Now you can listen for a submit

```javascript

form.addEventListener('submit', (e) => {
  e.preventDefault();
 
  // run an overall validation of all inputs when submit button is clicked
  ProfileForm.validate();
  
  // Do something if the form inputs are valid
  if(ProfileForm.isValid()){
    alert('Form is valid')
  }else{
    //
    ProfileForm.errorAction();
  }
})
```

##### Some useful functions
```javascript
ProfileForm.validate(); // check all inputs for errors and displays errors in the form 
ProfileForm.isValid(); // returns true if no error in the form and false if there are errors
ProfileForm.getInvalidGroups(); // returns an array of all inputs that contain errors
ProfileForm.getInvalidGroups(); // returns an array of all inputs that do not have errors
```

### Types of input fields currently supported
- Text