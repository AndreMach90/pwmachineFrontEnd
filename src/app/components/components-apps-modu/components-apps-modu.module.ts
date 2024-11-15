// App
import { ObtenerLocalidadClienteComponent } from '../dahsboards/cliente/modal-localidad-cliente/obtener-localidad-cliente/obtener-localidad-cliente.component';
import { UsuariosTemporalesMaquinaComponent } from '../dahsboards/equipo/usuarios-temporales-maquina/usuarios-temporales-maquina.component';
import { ModalUsuariosTemporalesComponent } from '../dahsboards/cliente/modal-usuarios-temporales/modal-usuarios-temporales.component';
import { ModalDataEquiposComponent } from '../dahsboards/repodash/filtrotransaccional/modal-data-equipos/modal-data-equipos.component';
import { ModalConfigExcelComponent } from '../dahsboards/repodash/filtrotransaccional/modal-config-excel/modal-config-excel.component';
import { ModalLocalidadClienteComponent } from '../dahsboards/cliente/modal-localidad-cliente/modal-localidad-cliente.component';
import { FiltrotransaccionalComponent } from '../dahsboards/repodash/filtrotransaccional/filtrotransaccional.component';
import { ModalTiendaCuentaComponent } from '../dahsboards/tienda/modal-tienda-cuenta/modal-tienda-cuenta.component';
import { HistorialAcreditacionComponent } from '../shared/historial-acreditacion/historial-acreditacion.component';
import { DashboardDataExportComponent } from '../shared/dashboard-data-export/dashboard-data-export.component';
import { MonitoreoEquiposComponent } from '../dahsboards/monitoreo-equipos/monitoreo-equipos.component';
import { MonitorearEquipoComponent } from '../dahsboards/monitorear-equipo/monitorear-equipo.component';
import { ModalClienteComponent } from '../dahsboards/cliente/modal-cliente/modal-cliente.component';
import { ProgressmachineComponent } from '../dahsboards/progressmachine/progressmachine.component';
import { NavsideExpDataComponent } from '../shared/navside-exp-data/navside-exp-data.component';
import { NavsideWorksComponent } from '../shared/navside-works/navside-works.component';
import { InitRepoComponent } from '../dahsboards/init-repo/init-repo.component';
import { RepodashComponent } from '../dahsboards/repodash/repodash.component';
import { UsuariosComponent } from '../dahsboards/usuarios/usuarios.component';
import { ModeldataComponent } from '../shared/modeldata/modeldata.component';
import { ClienteComponent } from '../dahsboards/cliente/cliente.component';
import { DahsboardsComponent } from '../dahsboards/dahsboards.component';
import { TiendaComponent } from '../dahsboards/tienda/tienda.component';
import { EquipoComponent } from '../dahsboards/equipo/equipo.component';
import { LoginComponent } from '../login/login.component';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// PrimeNG modules
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FileUploadModule } from 'primeng/fileupload';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TreeSelectModule } from 'primeng/treeselect';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OrderListModule } from 'primeng/orderlist';
import { PaginatorModule } from 'primeng/paginator';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SpeedDialModule } from 'primeng/speeddial';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TreeTableModule } from 'primeng/treetable';
import { AccordionModule } from 'primeng/accordion';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { DataViewModule } from 'primeng/dataview';
import { GalleriaModule } from 'primeng/galleria';
import { MessagesModule } from 'primeng/messages';
import { MegaMenuModule } from 'primeng/megamenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { SplitterModule } from 'primeng/splitter';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TerminalModule } from 'primeng/terminal';
import { TimelineModule } from 'primeng/timeline';
import { MenubarModule } from 'primeng/menubar';
import { SpinnerModule } from 'primeng/spinner';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { InplaceModule } from 'primeng/inplace';
import { SidebarModule } from 'primeng/sidebar';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { AnimateModule } from 'primeng/animate';
import { BlockUIModule } from 'primeng/blockui';
import { MessageModule } from 'primeng/message';
import { TabViewModule } from 'primeng/tabview';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { KnobModule } from 'primeng/knob';
import { DockModule } from 'primeng/dock';
import { MenuModule } from 'primeng/menu';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { NgxTimepickerModule } from 'ngx-timepicker';

@NgModule({
  declarations: [
    ClienteComponent,
    DahsboardsComponent,
    DashboardDataExportComponent,
    EquipoComponent,
    FiltrotransaccionalComponent,
    HistorialAcreditacionComponent,
    InitRepoComponent,
    LoginComponent,
    ModalConfigExcelComponent,
    ModalDataEquiposComponent,
    ModalClienteComponent,
    ModalTiendaCuentaComponent,
    ModalUsuariosTemporalesComponent,
    ModalLocalidadClienteComponent,
    ModeldataComponent,
    MonitoreoEquiposComponent,
    MonitorearEquipoComponent,
    NavsideWorksComponent,
    NavsideExpDataComponent,
    ObtenerLocalidadClienteComponent,
    ProgressmachineComponent,
    RepodashComponent,
    TiendaComponent,
    UsuariosComponent,
    UsuariosTemporalesMaquinaComponent,
  ],
  imports: [
    NgxTimepickerModule,
    MatFormFieldModule,
    CommonModule,
    MatTabsModule,
    MatSidenavModule,
    MatSliderModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // PRIME NG
    AvatarModule,
    AvatarGroupModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AccordionModule,
    AutoCompleteModule,
    BadgeModule,
    BreadcrumbModule,
    BlockUIModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    CascadeSelectModule,
    CheckboxModule,
    ChipsModule,
    ChipModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    VirtualScrollerModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DockModule,
    DragDropModule,
    DropdownModule,
    DynamicDialogModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    ImageModule,
    KnobModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    SelectButtonModule,
    SidebarModule,
    ScrollerModule,
    ScrollPanelModule,
    ScrollTopModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SpeedDialModule,
    SpinnerModule,
    SplitterModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TagModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TriStateCheckboxModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    AnimateModule,
    CardModule
  ], 
  exports: [
    LoginComponent,
    DahsboardsComponent,
    NavsideWorksComponent,
    UsuariosComponent,
    TiendaComponent,
    ClienteComponent,
    EquipoComponent,
    RepodashComponent,
    MonitoreoEquiposComponent,
    InitRepoComponent,
    ProgressmachineComponent,
    NavsideExpDataComponent,
    DashboardDataExportComponent,
    ModeldataComponent,
    HistorialAcreditacionComponent,
    ModalDataEquiposComponent,
    ModalConfigExcelComponent,
    FiltrotransaccionalComponent
  ]
})
export class ComponentsAppsModuModule { }
