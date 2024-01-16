import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import { Moment } from 'moment';

const DataPegawai = () => {

    let emptyPegawai = {
        id: null,
        id_pegawai: '',
        nama_pegawai: '',
        alamat: '',
        nomor_telpon: '',
        tanggal: '',
        email: '',
    };


    const [pegawais, setPegawais] = useState(null);
    const [pegawaiDialog, setPegawaiDialog] = useState(false);
    const [deletePegawaiDialog, setDeletePegawaiDialog] = useState(false);
    const [deletePegawaisDialog, setDeletepegawaisDialog] = useState(false);
    const [pegawai, setPegawai] = useState(emptyPegawai);
    const [selectedPegawais, setSelectedPegawais] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        ProductService.getDataPegawais().then((data) => setPegawais(data));
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    // };

    const openNew = () => {
        setPegawai(emptyPegawai);
        setSubmitted(false);
        setPegawaiDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPegawaiDialog(false);
    };

    const hideDeletePegawaiDialog = () => {
        setDeletePegawaiDialog(false);
    };

    const hideDeletePegawaisDialog = () => {
        setDeletepegawaisDialog(false);
    };

    const savePegawai = () => {
        setSubmitted(true);

        if (pegawai.nama_pegawai.trim()) {
            let _pegawais = [...pegawais];
            let _pegawai = { ...pegawai };
            if (pegawai.id) {
                const index = findIndexById(pegawai.id);

                _pegawais[index] = _pegawai;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Pegawai Updated', life: 3000 });
            } else {
                _pegawai.id = createId();
                _pegawai.id_pegawai = createId();
                // _pegawai.image = 'pegawai-placeholder.svg';
                _pegawais.push(_pegawai);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Pegawai Created', life: 3000 });
            }

            setPegawais(_pegawais);
            setPegawaiDialog(false);
            setPegawai(emptyPegawai);
        }
    };

    const editPegawai = (pegawai) => {
        setPegawai({ ...pegawai });
        setPegawaiDialog(true);
    };

    const confirmDeletePegawai = (pegawai) => {
        setPegawai(pegawai);
        setDeletePegawaiDialog(true);
    };

    const deletePegawai = () => {
        let _pegawais = pegawais.filter((val) => val.id !== pegawai.id);
        setPegawais(_pegawais);
        setDeletePegawaiDialog(false);
        setPegawai(emptyPegawai);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Pegawai Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < pegawais.length; i++) {
            if (pegawais[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletepegawaisDialog(true);
    };

    const deleteSelectedPegawais = () => {
        let _pegawais = pegawais.filter((val) => !selectedPegawais.includes(val));
        setPegawais(_pegawais);
        setDeletepegawaisDialog(false);
        setSelectedPegawais(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Pegawai Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _pegawai = { ...pegawai };
        _pegawai['category'] = e.value;
        setPegawai(_pegawai);
    };

    const onInputChange = (e, nama_pegawai) => {
        const val = (e.target && e.target.value) || '';
        let _pegawai = { ...pegawai };
        _pegawai[`${nama_pegawai}`] = val;

        setPegawai(_pegawai);
    };

    const onInputDateChange = (e, tanggal) => {
        const val = (e.target && e.target.value) || '';
        let _tanggal = { ...pegawai };
        _tanggal[`${tanggal}`] = val;

        setPegawai(_tanggal);
    };

    const onInputNumberChange = (e, nama_pegawai) => {
        const val = e.value || 0;
        let _pegawai = { ...pegawai };
        _pegawai[`${nama_pegawai}`] = val;

        setPegawai(_pegawai);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPegawais || !selectedPegawais.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const idpegawaiBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id Pegawai</span>
                {rowData.id_pegawai}
            </>
        );
    };

    const namaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nama Pegawai</span>
                {rowData.nama_pegawai}
            </>
        );
    };

    const alamatBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Alamat</span>
                {rowData.alamat}
            </>
        );
    };

    const nomortelponBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Alamat</span>
                {rowData.nomor_telpon}
            </>
        );
    };

    const tanggalBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tanggal</span>
                {rowData.tanggal.toLocaleString()}
            </>
        )


    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    // const imageBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Image</span>
    //             <img src={`/demo/images/pegawai/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };

    // const priceBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Price</span>
    //             {formatCurrency(rowData.price)}
    //         </>
    //     );
    // };

    // const categoryBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Category</span>
    //             {rowData.category}
    //         </>
    //     );
    // };

    // const ratingBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Reviews</span>
    //             <Rating value={rowData.rating} readOnly cancel={false} />
    //         </>
    //     );
    // };

    // const statusBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Status</span>
    //             <span className={`pegawai-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editPegawai(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeletePegawai(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Data Pegawai</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const pegawaiDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePegawai} />
        </>
    );
    const deletePegawaiDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePegawaiDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePegawai} />
        </>
    );
    const deletePegawaisDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePegawaisDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPegawais} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={pegawais}
                        selection={selectedPegawais}
                        onSelectionChange={(e) => setSelectedPegawais(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pegawais"
                        globalFilter={globalFilter}
                        emptyMessage="No pegawais found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="id_pegawai" header="Id Pegawai" sortable body={idpegawaiBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="nama_pegawai" header="Nama Pegawai" sortable body={namaBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="alamat" header="Alamat" sortable body={alamatBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nomor_telpon" header="Nomor Telpon" sortable body={nomortelponBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="tanggal" header="Tanggal" sortable body={tanggalBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                        {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column> */}
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column> */}
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={pegawaiDialog} style={{ width: '450px' }} header="Tambah Pegawai" modal className="p-fluid" footer={pegawaiDialogFooter} onHide={hideDialog}>
                        {/* {pegawai.image && <img src={`/demo/images/pegawai/${pegawai.image}`} alt={pegawai.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="nama_pegawai">Nama Pegawai</label>
                            <InputText id="nama_pegawai" value={pegawai.nama_pegawai} onChange={(e) => onInputChange(e, 'nama_pegawai')} required autoFocus className={classNames({ 'p-invalid': submitted && !pegawai.nama_pegawai })} />
                            {submitted && !pegawai.nama_pegawai && <small className="p-invalid">Nama Pegawai is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="alamat">Alamat</label>
                            <InputTextarea id="alamat" value={pegawai.alamat} onChange={(e) => onInputChange(e, 'alamat')} required className={classNames({ 'p-invalid': submitted && !pegawai.alamat })} />
                            {submitted && !pegawai.nama_pegawai && <small className="p-invalid">Alamat Pegawai is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nomor_telpon">Nomor Telpon</label>
                            <InputText id="nomor_telpon" value={pegawai.nomor_telpon} onChange={(e) => onInputChange(e, 'nomor_telpon')} required className={classNames({ 'p-invalid': submitted && !pegawai.nomor_telpon })} />
                            {submitted && !pegawai.nama_pegawai && <small className="p-invalid">Nomor Telpon is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="tanggal">Tanggal</label>
                            <Calendar id="tanggal" value={pegawai.tanggal} onChange={(e) => onInputDateChange(e, 'tanggal')} showButtonBar showIcon required />
                        </div>

                        {/* <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" nama_pegawai="category" value="Accessories" onChange={onCategoryChange} checked={pegawai.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" nama_pegawai="category" value="Clothing" onChange={onCategoryChange} checked={pegawai.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" nama_pegawai="category" value="Electronics" onChange={onCategoryChange} checked={pegawai.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" nama_pegawai="category" value="Fitness" onChange={onCategoryChange} checked={pegawai.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div> */}

                        {/* <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={pegawai.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={pegawai.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly="true" />
                            </div>
                        </div> */}
                    </Dialog>

                    <Dialog visible={deletePegawaiDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePegawaiDialogFooter} onHide={hideDeletePegawaiDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {pegawai && (
                                <span>
                                    Are you sure you want to delete <b>{pegawai.nama_pegawai}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePegawaisDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePegawaisDialogFooter} onHide={hideDeletePegawaisDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {pegawai && <span>Are you sure you want to delete the selected pegawai?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DataPegawai;
