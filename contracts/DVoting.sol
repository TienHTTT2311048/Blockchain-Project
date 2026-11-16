// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DVoting {
    address public admin;

    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        string description;
        bool isActive;
        uint256 candidateCount;
    }

    uint256 public electionCount;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    // Quy tắc chống bầu trùng: electionId => địa chỉ ví => đã bỏ phiếu chưa
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ElectionCreated(uint256 indexed electionId, string title);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event Voted(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);
    event ElectionStatusChanged(uint256 indexed electionId, bool isActive);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi Admin moi co quyen thuc hien");
        _;
    }

    constructor() {
        admin = msg.sender;

        // Khởi tạo sẵn 1 cuộc bầu cử mẫu khi Deploy để nhóm kiểm thử ngay
        createElection(
            "Bau cu Ban Chap Hanh Doan Khoa 2026",
            "Cuoc bau cu nhiem ky 2026 - 2027. Moi dia chi vi chi duoc bo phieu 1 lan."
        );
        addCandidate(1, "Nguyen Van A", "Ung cu vien vi tri Bi thu Doan Khoa");
        addCandidate(1, "Tran Thi B", "Ung cu vien vi tri Pho Bi thu Doan Khoa");
        addCandidate(1, "Le Van C", "Ung cu vien vi tri Uy vien Ban Chap Hanh");
    }

    // 1. Tạo cuộc bầu cử mới (Chỉ Admin)
    function createElection(string memory _title, string memory _description) public onlyAdmin {
        electionCount++;
        elections[electionCount] = Election({
            id: electionCount,
            title: _title,
            description: _description,
            isActive: true,
            candidateCount: 0
        });
        emit ElectionCreated(electionCount, _title);
    }

    // 2. Thêm ứng viên vào cuộc bầu cử (Chỉ Admin)
    function addCandidate(uint256 _electionId, string memory _name, string memory _description) public onlyAdmin {
        require(_electionId > 0 && _electionId <= electionCount, "Cuoc bau cu khong ton tai");
        Election storage election = elections[_electionId];
        require(election.isActive, "Cuoc bau cu da dong, khong the them ung vien");

        election.candidateCount++;
        uint256 candidateId = election.candidateCount;
        candidates[_electionId][candidateId] = Candidate({
            id: candidateId,
            name: _name,
            description: _description,
            voteCount: 0
        });
        emit CandidateAdded(_electionId, candidateId, _name);
    }
    // 3. Đóng / Mở cuộc bầu cử (Chỉ Admin)
    function setElectionStatus(uint256 _electionId, bool _isActive) public onlyAdmin {
        require(_electionId > 0 && _electionId <= electionCount, "Cuoc bau cu khong ton tai");
        elections[_electionId].isActive = _isActive;
        emit ElectionStatusChanged(_electionId, _isActive);
    }

    // 4. Thực hiện bỏ phiếu (Chống bỏ phiếu trùng)
    function vote(uint256 _electionId, uint256 _candidateId) public {
        require(_electionId > 0 && _electionId <= electionCount, "Cuoc bau cu khong ton tai");
        Election memory election = elections[_electionId];
        require(election.isActive, "Cuoc bau cu da ket thuc");
        require(!hasVoted[_electionId][msg.sender], "Dia chi vi nay da bo phieu roi");
        require(_candidateId > 0 && _candidateId <= election.candidateCount, "Ung vien khong hop le");

        hasVoted[_electionId][msg.sender] = true;
        candidates[_electionId][_candidateId].voteCount++;

        emit Voted(_electionId, _candidateId, msg.sender);
    }

    // 5. Lấy toàn bộ danh sách cuộc bầu cử (Phục vụ Frontend)
    function getAllElections() public view returns (Election[] memory) {
        Election[] memory list = new Election[](electionCount);
        for (uint256 i = 1; i <= electionCount; i++) {
            list[i - 1] = elections[i];
        }
        return list;
    }

    // 6. Lấy toàn bộ danh sách ứng viên của 1 cuộc bầu cử (Phục vụ Frontend)
    function getCandidates(uint256 _electionId) public view returns (Candidate[] memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Cuoc bau cu khong ton tai");
        uint256 count = elections[_electionId].candidateCount;
        Candidate[] memory list = new Candidate[](count);
        for (uint256 i = 1; i <= count; i++) {
            list[i - 1] = candidates[_electionId][i];
        }
        return list;
    }
}