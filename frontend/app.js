// --- Cấu hình Smart Contract ---
const CONTRACT_ADDRESS = "0xYOUR_SMART_CONTRACT_ADDRESS_HERE";
const CONTRACT_ABI = [
    "function getElectionsCount() public view returns (uint256)",
    "function elections(uint256) public view returns (uint256 id, string memory name, bool isActive)",
    "function getCandidates(uint256 _electionId) public view returns (tuple(uint256 id, string name, uint256 voteCount)[])",
    "function vote(uint256 _electionId, uint256 _candidateId) public",
    "function hasVoted(uint256 _electionId, address _voter) public view returns (bool)",
    "event Voted(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter)"
];

let provider;
let signer;
let votingContract;
let currentUserAddress = "";

// =================================================================
// CHỨC NĂNG 1: KẾT NỐI METAMASK[cite: 1]
// =================================================================
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert("Vui lòng cài đặt tiện ích MetaMask trên trình duyệt!");
        return;
    }

    try {
        // Khởi tạo Ethers BrowserProvider
        provider = new ethers.BrowserProvider(window.ethereum);
        
        // Yêu cầu truy cập tài khoản MetaMask
        const accounts = await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        currentUserAddress = accounts[0];

        // Cập nhật giao diện Trạng thái & Ví[cite: 1]
        const shortAddress = `${currentUserAddress.substring(0, 6)}...${currentUserAddress.slice(-4)}`;
        document.getElementById("btnConnect").className = "btn btn-outline-success btn-sm bg-white text-dark fw-bold";
        document.getElementById("btnConnect").innerText = shortAddress;
        
        const network = await provider.getNetwork();
        document.getElementById("networkBadge").innerText = `Chain ID: ${network.chainId}`;
        document.getElementById("networkBadge").className = "badge bg-info text-dark me-2";
        
        document.getElementById("walletInfo").innerText = `Ví đang kết nối: ${currentUserAddress}`;

        // Khởi tạo Contract instance
        votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Lắng nghe sự thay đổi tài khoản trên MetaMask
        window.ethereum.on('accountsChanged', (newAccounts) => {
            window.location.reload();
        });

        // Tải dữ liệu bầu cử[cite: 1]
        await loadElections();

    } catch (error) {
        console.error("Lỗi khi kết nối ví MetaMask:", error);
        alert("Kết nối ví thất bại: " + error.message);
    }
}

// =================================================================
// CHỨC NĂNG 2: XÂY DỰNG DANH SÁCH CUỘC BẦU CỬ VÀ ỨNG VIÊN[cite: 1]
// =================================================================
async function loadElections() {
    if (!votingContract) return;

    const electionsListDiv = document.getElementById("electionsList");
    const selectElection = document.getElementById("selectElection");
    
    electionsListDiv.innerHTML = '<div class="spinner-border text-primary my-3"></div>';
    selectElection.innerHTML = '<option value="">-- Chọn cuộc bầu cử --</option>';

    try {
        const count = await votingContract.getElectionsCount();
        let htmlContent = "";

        if (Number(count) === 0) {
            electionsListDiv.innerHTML = '<p class="text-muted">Hiện chưa có cuộc bầu cử nào.</p>';
            return;
        }

        for (let i = 1; i <= count; i++) {
            const election = await votingContract.elections(i);
            const candidates = await votingContract.getCandidates(i);

            // Thêm vào Select Box của Form Bỏ phiếu
            const option = document.createElement("option");
            option.value = election.id;
            option.text = election.name;
            selectElection.appendChild(option);

            // Render Card hiển thị danh sách[cite: 1]
            htmlContent += `
                <div class="border rounded p-3 mb-3 bg-white shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="fw-bold mb-0 text-primary">#${election.id}. ${election.name}</h6>
                        <span class="badge ${election.isActive ? 'bg-success' : 'bg-danger'}">
                            ${election.isActive ? 'Đang diễn ra' : 'Đã kết thúc'}
                        </span>
                    </div>
                    <p class="small text-muted mb-2">Danh sách ứng viên:</p>
                    <ul class="list-group list-group-flush">
            `;

            candidates.forEach(c => {
                htmlContent += `
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-1">
                        <span>👤 <strong>${c.name}</strong> (ID: ${c.id})</span>
                        <span class="badge bg-secondary rounded-pill">${c.voteCount.toString()} phiếu</span>
                    </li>
                `;
            });

            htmlContent += `</ul></div>`;
        }

        electionsListDiv.innerHTML = htmlContent;

    } catch (error) {
        console.error("Lỗi khi tải danh sách bầu cử:", error);
        electionsListDiv.innerHTML = '<p class="text-danger">Không thể tải dữ liệu bầu cử.</p>';
    }
}

// =================================================================
// CHỨC NĂNG 3: XỬ LÝ GIAO DIỆN BỎ PHIẾU[cite: 1]
// =================================================================
async function onElectionSelectChange() {
    const electionId = document.getElementById("selectElection").value;
    const selectCandidate = document.getElementById("selectCandidate");
    const btnVote = document.getElementById("btnVote");

    selectCandidate.innerHTML = '<option value="">-- Chọn ứng viên --</option>';

    if (!electionId) {
        btnVote.disabled = true;
        document.getElementById("resultsContainer").innerHTML = '<div class="text-muted text-center py-3">Chọn cuộc bầu cử để xem kết quả[cite: 1].</div>';
        return;
    }

    try {
        // Tải danh sách ứng viên tương ứng với Cuộc bầu cử đã chọn
        const candidates = await votingContract.getCandidates(electionId);
        candidates.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.text = `${c.name} (ID: ${c.id})`;
            selectCandidate.appendChild(opt);
        });

        // Kiểm tra xem ví hiện tại đã bỏ phiếu chưa
        const voted = await votingContract.hasVoted(electionId, currentUserAddress);
        if (voted) {
            btnVote.disabled = true;
            btnVote.innerText = "Bạn đã bỏ phiếu cho cuộc bầu cử này";
        } else {
            btnVote.disabled = false;
            btnVote.innerText = "Xác nhận bỏ phiếu[cite: 1]";
        }

        // Tải bảng kết quả tương ứng[cite: 1]
        await renderResults(electionId, candidates);

    } catch (error) {
        console.error("Lỗi cập nhật ứng viên:", error);
    }
}

async function handleVote(event) {
    event.preventDefault();

    const electionId = document.getElementById("selectElection").value;
    const candidateId = document.getElementById("selectCandidate").value;

    if (!electionId || !candidateId) {
        alert("Vui lòng chọn đầy đủ cuộc bầu cử và ứng viên!");
        return;
    }

    const btnVote = document.getElementById("btnVote");
    btnVote.disabled = true;
    btnVote.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý giao dịch...';

    try {
        // Gọi hàm Smart Contract gửi transaction lên mạng Blockchain
        const tx = await votingContract.vote(electionId, candidateId);
        alert(`Giao dịch đã được gửi! Hash: ${tx.hash}\nĐang chờ xác thực khối...`);
        
        // Chờ transaction hoàn tất
        await tx.wait();

        alert("🎉 Bỏ phiếu thành công!");
        await loadElections();
        await onElectionSelectChange();

    } catch (error) {
        console.error("Lỗi bỏ phiếu:", error);
        alert("Giao dịch thất bại hoặc bị từ chối: " + (error.reason || error.message));
        btnVote.disabled = false;
        btnVote.innerText = "Xác nhận bỏ phiếu[cite: 1]";
    }
}

// =================================================================
// CHỨC NĂNG 4: HIỂN THỊ KẾT QUẢ BỎ PHIẾU REAL-TIME[cite: 1]
// =================================================================
async function renderResults(electionId, candidates) {
    const resultsContainer = document.getElementById("resultsContainer");
    
    // Tính tổng số phiếu bầu
    let totalVotes = 0;
    candidates.forEach(c => {
        totalVotes += Number(c.voteCount);
    });

    let resultsHtml = `
        <div class="mb-3 text-center">
            <span class="fw-bold">Tổng số phiếu đã bầu: </span>
            <span class="badge bg-primary fs-6">${totalVotes}</span>
        </div>
    `;

    candidates.forEach(c => {
        const votes = Number(c.voteCount);
        const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;

        resultsHtml += `
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semibold">${c.name}</span>
                    <span class="text-muted small">${votes} phiếu (${percentage}%)</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                         role="progressbar" 
                         style="width: ${percentage}%;" 
                         aria-valuenow="${percentage}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${percentage}%
                    </div>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = resultsHtml;
}