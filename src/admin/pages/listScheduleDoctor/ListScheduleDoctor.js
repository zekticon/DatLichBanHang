import './ListScheduleDoctor.scss';
import DatatableDoctorSchedule from '~/admin/components/datatable/DatatableDoctorSchedule';
function ListScheduleDoctor({ data }) {
    const action = {};
    if (data === 'history') {
        action.action = 'history';
        action.title = 'Lịch sử khám';
    }

    return (
        <>
            <DatatableDoctorSchedule action={data === 'history' ? action : null} />
        </>
    );
}

export default ListScheduleDoctor;
