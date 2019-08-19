// import { configure } from 'enzyme'
const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })
