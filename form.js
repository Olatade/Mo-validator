import UploadImage from "./upload_image.js";
import MoValidator from "./mo_validator.js";

const form = document.getElementById('profile-form');
const formImageGroup = form.querySelector("div[data-group-id='upload-image']");
console.log(formImageGroup);

const validationConfig = {
  image: {
    name: 'image',
    displayName: 'Image',
    tag: 'input',
    type: 'image',
    required: true
  },
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
  surname: {
    name: 'surname',
    displayName: 'Surname',
    tag: 'input',
    type: 'text',
    required: true,
    rules: ['only-alphabets'],
  },
  email: {
    name: 'email',
    displayName: 'Email',
    tag: 'input',
    type: 'text',
    required: true,
  },
  gender: {
    name: 'gender',
    displayName: 'Gender',
    tag: 'select',
    type: 'text',
    required: true,
  },
  continent: {
    name: 'continent',
    displayName: 'Continent',
    tag: 'input',
    type: 'text',
    required: true,
  },
  dateOfBirth: {
    name: 'dateOfBirth',
    displayName: 'Date of birth',
    tag: 'input',
    type: 'date',
    required: true,
  },
};

// pass the image field into the upload image function
new UploadImage(formImageGroup, Croppie);
const ProfileForm = new MoValidator(form, validationConfig);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  ProfileForm.validate();
  if(ProfileForm.isValid()){
    console.log(ProfileForm.getValidGroups());
    console.log('form works')
  }else{
    // make form button turn red and scroll to the first error in the form
    ProfileForm.errorAction();
    console.log(ProfileForm.getInvalidGroups());
  }
});