import Vue from 'vue'
import {
    Form,
    FormItem,
    Input,
    Button,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    MenuItem,
    Submenu,
    Avatar,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Table,
    TableColumn,
    Card,
    Loading,
    Upload,
    MessageBox,
    Dialog,
    Progress,
    Popover,
    Tooltip
} from 'element-ui'


Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Avatar)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Loading.directive)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Progress)
Vue.use(Popover)
Vue.use(Tooltip)