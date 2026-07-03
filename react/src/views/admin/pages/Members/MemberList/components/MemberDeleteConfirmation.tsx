import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    toggleDeleteConfirmation,
    getMembers,
    deleteMember,
} from '@/store/slices/admin/membersSlice'

const MemberDeleteConfirmation = () => {
    const dispatch = useAppDispatch()

    const dialogOpen = useAppSelector(
        (state) => state.memberList.deleteConfirmation,
    )
    const selectedMember = useAppSelector(
        (state) => state.memberList.selectedMember,
    )

    const tableData = useAppSelector((state) => state.memberList.tableData)
    const filterData = useAppSelector((state) => state.memberList.filterData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))

        const id = selectedMember?.id
        if (!id) {
            toast.push(
                <Notification
                    title="No member selected"
                    type="warning"
                    duration={2500}
                >
                    Please select a member to delete.
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        try {
            const success = await dispatch(deleteMember({ id })).unwrap()

            if (success) {
                dispatch(getMembers({ ...tableData, filterData }))

                toast.push(
                    <Notification
                        title="Successfully Deleted"
                        type="success"
                        duration={2500}
                    >
                        Member successfully deleted
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        } catch (err) {
            toast.push(
                <Notification
                    title="Delete failed"
                    type="danger"
                    duration={3500}
                >
                    Could not delete member. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Delete member"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Are you sure you want to delete this member? This action cannot
                be undone.
            </p>
        </ConfirmDialog>
    )
}

export default MemberDeleteConfirmation
