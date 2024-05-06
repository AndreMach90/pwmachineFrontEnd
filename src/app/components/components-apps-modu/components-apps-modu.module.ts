import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//#region Angular Material

import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
// import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { DahsboardsComponent } from '../dahsboards/dahsboards.component';
import { NavsideWorksComponent } from '../shared/navside-works/navside-works.component';


import { UsuariosComponent } from '../dahsboards/usuarios/usuarios.component';
import { TiendaComponent } from '../dahsboards/tienda/tienda.component';
import { EquipoComponent } from '../dahsboards/equipo/equipo.component';
import { RepodashComponent } from '../dahsboards/repodash/repodash.component';
import { ClienteComponent } from '../dahsboards/cliente/cliente.component';
import { ModalClienteComponent } from '../dahsboards/cliente/modal-cliente/modal-cliente.component';
import { JwtModule } from "@auth0/angular-jwt";

// Import PrimeNG modules
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
// import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
// import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
// import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
// import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MonitoreoEquiposComponent } from '../dahsboards/monitoreo-equipos/monitoreo-equipos.component';
import { InitRepoComponent } from '../dahsboards/init-repo/init-repo.component';
import { ModalTiendaCuentaComponent } from '../dahsboards/tienda/modal-tienda-cuenta/modal-tienda-cuenta.component';
import { UsuariosTemporalesMaquinaComponent } from '../dahsboards/equipo/usuarios-temporales-maquina/usuarios-temporales-maquina.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CollectiongraphComponent } from '../dahsboards/repodash/collectiongraph/collectiongraph.component';
import { TablaTransaccionesComponent } from '../dahsboards/repodash/tabla-transacciones/tabla-transacciones.component';
import { NgxTimepickerModule } from 'ngx-timepicker';
import { FiltrotransaccionalComponent } from '../dahsboards/repodash/filtrotransaccional/filtrotransaccional.component';
import { ProgressmachineComponent } from '../dahsboards/progressmachine/progressmachine.component';
import { ModalUsuariosTemporalesComponent } from '../dahsboards/cliente/modal-usuarios-temporales/modal-usuarios-temporales.component';
import { ModalConfigExcelComponent } from '../dahsboards/repodash/filtrotransaccional/modal-config-excel/modal-config-excel.component';
import { ModalDataEquiposComponent } from '../dahsboards/repodash/filtrotransaccional/modal-data-equipos/modal-data-equipos.component';
import { NavsideExpDataComponent } from '../shared/navside-exp-data/navside-exp-data.component';
import { DashboardDataExportComponent } from '../shared/dashboard-data-export/dashboard-data-export.component';
import { ModeldataComponent } from '../shared/modeldata/modeldata.component';
import { HistorialAcreditacionComponent } from '../shared/historial-acreditacion/historial-acreditacion.component';
import { ModalLocalidadClienteComponent } from '../dahsboards/cliente/modal-localidad-cliente/modal-localidad-cliente.component';
import { ObtenerLocalidadClienteComponent } from '../dahsboards/cliente/modal-localidad-cliente/obtener-localidad-cliente/obtener-localidad-cliente.component';

@NgModule({
  declarations: [
    ModalConfigExcelComponent,
    FiltrotransaccionalComponent,
    TablaTransaccionesComponent,
    CollectiongraphComponent,
    LoginComponent,
    DahsboardsComponent,
    NavsideWorksComponent,
    NavsideExpDataComponent,
    UsuariosComponent,
    TiendaComponent,
    ClienteComponent,
    EquipoComponent,
    RepodashComponent,
    ModalClienteComponent,
    MonitoreoEquiposComponent,
    InitRepoComponent,
    ModalTiendaCuentaComponent,
    UsuariosTemporalesMaquinaComponent,
    ProgressmachineComponent,
    ModalUsuariosTemporalesComponent,
    MonitoreoEquiposComponent,
    ModalDataEquiposComponent,
    DashboardDataExportComponent,
    ModeldataComponent,
    HistorialAcreditacionComponent,
    ModalLocalidadClienteComponent,
    ObtenerLocalidadClienteComponent
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

    /** PRIME NG */
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
    TablaTransaccionesComponent,
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
    CollectiongraphComponent,
    FiltrotransaccionalComponent,
    ProgressmachineComponent,
    NavsideExpDataComponent,
    DashboardDataExportComponent,
    ModeldataComponent,
    HistorialAcreditacionComponent
  ]
})
export class ComponentsAppsModuModule { }
