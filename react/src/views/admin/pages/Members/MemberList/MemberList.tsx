import MemberTable from './components/MemberTable'
import MemberTableTools from './components/MemberTableTools'
import { MemberListWrapper, MemberListHeader } from './MemberList.styled'

const MemberList = () => {
    return (
        <MemberListWrapper>
            <MemberListHeader>
                <h3>Members</h3>
                <MemberTableTools />
            </MemberListHeader>
            <MemberTable />
        </MemberListWrapper>
    )
}

export default MemberList
