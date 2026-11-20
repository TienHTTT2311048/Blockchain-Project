// =========================================================================
// 1. CẤU HÌNH SMART CONTRACT ĐỌC TỪ BIẾN MÔI TRƯỜNG (.env -> config.js)
// =========================================================================
const CONTRACT_ADDRESS = window.ENV?.CONTRACT_ADDRESS;
const ADMIN_ADDRESS = window.ENV?.ADMIN_ADDRESS;
const TARGET_CHAIN_ID = Number(window.ENV?.CHAIN_ID || 11155111); // Mặc định Sepolia (11155111)

if (!CONTRACT_ADDRESS || !ADMIN_ADDRESS) {
    console.error("Thiếu cấu hình biến môi trường! Hãy chạy 'npm start' để nạp tệp .env.");
    alert("Lỗi cấu hình: Chưa nạp được CONTRACT_ADDRESS hoặc ADMIN_ADDRESS từ tệp .env!");
}

const CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" }
        ],
        "name": "CandidateAdded",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_title", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" }
        ],
        "name": "createElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "title", "type": "string" }
        ],
        "name": "ElectionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": false, "internalType": "bool", "name": "isActive", "type": "bool" }
        ],
        "name": "ElectionStatusChanged",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
            { "internalType": "bool", "name": "_isActive", "type": "bool" }
        ],
        "name": "setElectionStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
            { "internalType": "uint256", "name": "_candidateId", "type": "uint256" }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "voter", "type": "address" }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "candidates",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "string", "name": "description", "type": "string" },
            { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "electionCount",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "elections",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "string", "name": "title", "type": "string" },
            { "internalType": "string", "name": "description", "type": "string" },
            { "internalType": "bool", "name": "isActive", "type": "bool" },
            { "internalType": "uint256", "name": "candidateCount", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllElections",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "string", "name": "description", "type": "string" },
                    { "internalType": "bool", "name": "isActive", "type": "bool" },
                    { "internalType": "uint256", "name": "candidateCount", "type": "uint256" }
                ],
                "internalType": "struct DVoting.Election[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" }
        ],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "string", "name": "description", "type": "string" },
                    { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
                ],
                "internalType": "struct DVoting.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "hasVoted",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider = null;
let signer = null;
let votingContract = null;
let userAddress = null;
let electionsData = [];

// =========================================================================
// 1. ĐĂNG NHẬP (KẾT NỐI VÍ), ĐỔI VÍ & ĐĂNG XUẤT
// =========================================================================
async function connectWallet(forceSelectAccount = false) {
    if (typeof window.ethereum === "undefined") {
        alert("Vui lòng cài đặt tiện ích MetaMask trên trình duyệt!");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);

        // Nếu bấm "Đổi ví", ép MetaMask mở hộp thoại chọn tài khoản
        if (forceSelectAccount) {
            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }]
            });
        } else {
            await provider.send("eth_requestAccounts", []);
        }

        signer = await provider.getSigner();
        userAddress = await signer.getAddress();

        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        const networkBadge = document.getElementById("networkBadge");
        if (chainId === TARGET_CHAIN_ID) {
            networkBadge.textContent = `Sepolia (Chain ID: ${TARGET_CHAIN_ID})`;
            networkBadge.className = "badge bg-info text-dark";
        } else {
            networkBadge.textContent = `Sai mạng (Chain ID: ${chainId})`;
            networkBadge.className = "badge bg-danger";
            alert("Vui lòng chuyển MetaMask sang mạng thử nghiệm Sepolia!");
        }

        // Cập nhật thanh điều hướng: Ẩn nút Đăng nhập, hiện ví + Đổi ví + Đăng xuất
        document.getElementById("btnConnect").classList.add("d-none");
        const accountGroup = document.getElementById("userAccountGroup");
        if (accountGroup) {
            accountGroup.classList.remove("d-none");
            accountGroup.classList.add("d-flex");
        }
        const walletBadge = document.getElementById("walletBadge");
        if (walletBadge) {
            walletBadge.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        }

        document.getElementById("walletInfo").textContent = `Địa chỉ cử tri: ${userAddress}`;

        votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Kiểm tra ví hiện tại có trùng với địa chỉ admin() trong Smart Contract và biến môi trường không
        const contractAdmin = await votingContract.admin();
        const isEnvAdmin = ADMIN_ADDRESS ? userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase() : true;
        const isContractAdmin = userAddress.toLowerCase() === contractAdmin.toLowerCase();

        const adminPanel = document.getElementById("adminPanel");
        if (adminPanel) {
            if (isContractAdmin && isEnvAdmin) {
                adminPanel.classList.remove("d-none");
            } else {
                adminPanel.classList.add("d-none");
            }
        }

        await loadElections();
    } catch (error) {
        console.error("Lỗi kết nối MetaMask:", error);
        alert("Không thể kết nối MetaMask: " + (error.shortMessage || error.message));
    }
}

// Mở hộp thoại MetaMask để chuyển sang tài khoản ví khác
async function switchAccount() {
    await connectWallet(true);
}

// Đăng xuất: Xóa phiên kết nối hiện tại, ẩn bảng Admin và đưa giao diện về ban đầu
function disconnectWallet() {
    provider = null;
    signer = null;
    votingContract = null;
    userAddress = null;
    electionsData = [];

    const networkBadge = document.getElementById("networkBadge");
    networkBadge.textContent = "Chưa kết nối";
    networkBadge.className = "badge bg-secondary";

    document.getElementById("btnConnect").classList.remove("d-none");
    const accountGroup = document.getElementById("userAccountGroup");
    if (accountGroup) {
        accountGroup.classList.add("d-none");
        accountGroup.classList.remove("d-flex");
    }

    document.getElementById("walletInfo").textContent = "";

    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
        adminPanel.classList.add("d-none");
    }

    document.getElementById("electionsList").innerHTML =
        `<div class="text-center py-4 text-muted">Đã đăng xuất. Vui lòng bấm "Đăng nhập (Kết nối ví)" để tiếp tục...</div>`;
    document.getElementById("selectElection").innerHTML = "";
    document.getElementById("selectCandidate").innerHTML = "";

    const btnVote = document.getElementById("btnVote");
    btnVote.disabled = true;
    btnVote.textContent = "Xác nhận bỏ phiếu";
    btnVote.className = "btn btn-success w-100";

    document.getElementById("resultsContainer").innerHTML =
        `<div class="text-muted text-center py-3">Chọn cuộc bầu cử để xem kết quả.</div>`;
}

// =========================================================================
// 2. TẢI DANH SÁCH CUỘC BẦU CỬ & ỨNG VIÊN TỪ SMART CONTRACT
// =========================================================================
async function loadElections() {
    if (!votingContract) {
        alert("Vui lòng kết nối ví MetaMask trước!");
        return;
    }

    const electionsListEl = document.getElementById("electionsList");
    const selectElectionEl = document.getElementById("selectElection");

    electionsListEl.innerHTML = `<div class="text-center py-4 text-muted">Đang tải dữ liệu từ Blockchain...</div>`;

    try {
        const rawElections = await votingContract.getAllElections();
        electionsData = [];

        if (rawElections.length === 0) {
            electionsListEl.innerHTML = `<div class="alert alert-warning mb-0">Hiện chưa có cuộc bầu cử nào được tạo.</div>`;
            selectElectionEl.innerHTML = `<option value="">-- Không có cuộc bầu cử --</option>`;
            return;
        }

        for (let i = 0; i < rawElections.length; i++) {
            const el = rawElections[i];
            const id = Number(el.id);
            const rawCandidates = await votingContract.getCandidates(id);

            const candidates = rawCandidates.map((c) => ({
                id: Number(c.id),
                name: c.name,
                description: c.description,
                voteCount: Number(c.voteCount)
            }));

            electionsData.push({
                id: id,
                title: el.title,
                description: el.description,
                isActive: el.isActive,
                candidates: candidates
            });
        }

        renderElectionsList();
        populateElectionSelect();
        await onElectionSelectChange();
    } catch (error) {
        console.error("Lỗi tải dữ liệu bầu cử:", error);
        electionsListEl.innerHTML = `<div class="text-danger">Không thể tải dữ liệu bầu cử. Kiểm tra lại mạng Sepolia trên MetaMask.</div>`;
    }
}

function renderElectionsList() {
    const electionsListEl = document.getElementById("electionsList");

    electionsListEl.innerHTML = electionsData.map((el) => {
        const statusBadge = el.isActive
            ? `<span class="badge bg-success">Đang mở</span>`
            : `<span class="badge bg-secondary">Đã đóng</span>`;

        const candidatesHtml = el.candidates.length > 0
            ? el.candidates.map((c) => `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">#${c.id}. ${c.name}</div>
                        <small class="text-muted">${c.description}</small>
                    </div>
                    <span class="badge bg-primary rounded-pill">${c.voteCount} phiếu</span>
                </li>
            `).join("")
            : `<li class="list-group-item text-muted">Chưa có ứng viên</li>`;

        return `
            <div class="border rounded p-3 mb-3 bg-light">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold text-primary mb-0">#${el.id} ${el.title}</h6>
                    ${statusBadge}
                </div>
                <p class="text-muted small mb-3">${el.description}</p>
                <div class="fw-semibold small mb-2">Danh sách ứng viên (${el.candidates.length}):</div>
                <ol class="list-group">
                    ${candidatesHtml}
                </ol>
            </div>
        `;
    }).join("");
}

function populateElectionSelect() {
    const selectElectionEl = document.getElementById("selectElection");
    selectElectionEl.innerHTML = electionsData.map((el) => `
        <option value="${el.id}">#${el.id} ${el.title}</option>
    `).join("");

    const adminSelectEl = document.getElementById("adminSelectElection");
    if (adminSelectEl) {
        const activeElections = electionsData.filter((el) => el.isActive);
        adminSelectEl.innerHTML = activeElections.length > 0
            ? activeElections.map((el) => `<option value="${el.id}">#${el.id} ${el.title}</option>`).join("")
            : `<option value="">-- Không có cuộc bầu cử đang mở --</option>`;
    }

    const adminToggleSelectEl = document.getElementById("adminToggleSelectElection");
    if (adminToggleSelectEl) {
        adminToggleSelectEl.innerHTML = electionsData.length > 0
            ? electionsData.map((el) => `<option value="${el.id}">#${el.id} ${el.title} (${el.isActive ? "Đang mở" : "Đã khóa"})</option>`).join("")
            : `<option value="">-- Không có cuộc bầu cử --</option>`;
    }
}

// =========================================================================
// 3. CẬP NHẬT FORM BỎ PHIẾU & KẾT QUẢ REAL-TIME KHI ĐỔI CUỘC BẦU CỬ
// =========================================================================
async function onElectionSelectChange() {
    const selectElectionEl = document.getElementById("selectElection");
    const selectCandidateEl = document.getElementById("selectCandidate");
    const btnVote = document.getElementById("btnVote");

    const electionId = Number(selectElectionEl.value);
    const election = electionsData.find((e) => e.id === electionId);

    if (!election) {
        selectCandidateEl.innerHTML = "";
        btnVote.disabled = true;
        return;
    }

    if (election.candidates.length === 0) {
        selectCandidateEl.innerHTML = `<option value="">-- Chưa có ứng viên --</option>`;
    } else {
        selectCandidateEl.innerHTML = election.candidates.map((c) => `
            <option value="${c.id}">#${c.id} ${c.name}</option>
        `).join("");
    }

    try {
        const voted = await votingContract.hasVoted(electionId, userAddress);
        if (!election.isActive) {
            btnVote.disabled = true;
            btnVote.textContent = "Cuộc bầu cử đã kết thúc";
            btnVote.className = "btn btn-secondary w-100";
        } else if (voted) {
            btnVote.disabled = true;
            btnVote.textContent = "Bạn đã bỏ phiếu cho cuộc bầu cử này";
            btnVote.className = "btn btn-secondary w-100";
        } else if (election.candidates.length === 0) {
            btnVote.disabled = true;
            btnVote.textContent = "Chưa có ứng viên để bỏ phiếu";
            btnVote.className = "btn btn-secondary w-100";
        } else {
            btnVote.disabled = false;
            btnVote.textContent = "Xác nhận bỏ phiếu";
            btnVote.className = "btn btn-success w-100";
        }
    } catch (error) {
        console.error("Lỗi kiểm tra trạng thái bỏ phiếu:", error);
    }

    renderResults(election);
}

function renderResults(election) {
    const resultsContainer = document.getElementById("resultsContainer");

    if (election.candidates.length === 0) {
        resultsContainer.innerHTML = `<div class="text-muted text-center py-3">Chưa có dữ liệu ứng viên.</div>`;
        return;
    }

    const totalVotes = election.candidates.reduce((sum, c) => sum + c.voteCount, 0);

    const barsHtml = election.candidates.map((c) => {
        const percent = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
        return `
            <div class="mb-3">
                <div class="d-flex justify-content-between small fw-semibold mb-1">
                    <span>${c.name}</span>
                    <span>${c.voteCount} phiếu (${percent}%)</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-success progress-bar-striped" role="progressbar"
                        style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
                        ${percent}%
                    </div>
                </div>
            </div>
        `;
    }).join("");

    resultsContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <span class="fw-bold text-dark">${election.title}</span>
            <span class="badge bg-dark">Tổng phiếu: ${totalVotes}</span>
        </div>
        ${barsHtml}
    `;
}

// =========================================================================
// 4. XỬ LÝ GỬI GIAO DỊCH BỎ PHIẾU LÊN BLOCKCHAIN
// =========================================================================
async function handleVote(event) {
    event.preventDefault();

    if (!votingContract) {
        alert("Vui lòng kết nối ví MetaMask!");
        return;
    }

    const electionId = Number(document.getElementById("selectElection").value);
    const candidateId = Number(document.getElementById("selectCandidate").value);
    const btnVote = document.getElementById("btnVote");

    if (!electionId || !candidateId) {
        alert("Vui lòng chọn đầy đủ cuộc bầu cử và ứng viên!");
        return;
    }

    try {
        btnVote.disabled = true;
        btnVote.textContent = "Đang chờ xác nhận trên MetaMask...";

        const tx = await votingContract.vote(electionId, candidateId);
        btnVote.textContent = "Đang ghi nhận phiếu lên Blockchain...";

        await tx.wait();
        alert("Bỏ phiếu thành công! Dữ liệu đã được lưu trên Blockchain.");
        await loadElections();
    } catch (error) {
        console.error("Lỗi khi bỏ phiếu:", error);
        alert("Bỏ phiếu thất bại: " + (error.reason || error.shortMessage || error.message));
        btnVote.disabled = false;
        btnVote.textContent = "Xác nhận bỏ phiếu";
    }
}

// =========================================================================
// 5. CHỨC NĂNG QUẢN TRỊ VIÊN (CHỈ ADMIN MỚI GỌI ĐƯỢC TRÊN SMART CONTRACT)
// =========================================================================
async function handleCreateElection(event) {
    event.preventDefault();
    if (!votingContract) return alert("Vui lòng kết nối ví MetaMask!");

    const title = document.getElementById("adminElectionTitle").value.trim();
    const desc = document.getElementById("adminElectionDesc").value.trim();
    const btn = document.getElementById("btnCreateElection");

    try {
        btn.disabled = true;
        btn.textContent = "Đang xác nhận trên MetaMask...";

        const tx = await votingContract.createElection(title, desc);
        btn.textContent = "Đang ghi lên Blockchain...";
        await tx.wait();

        alert("Tạo cuộc bầu cử mới thành công!");
        document.getElementById("adminElectionTitle").value = "";
        document.getElementById("adminElectionDesc").value = "";
        await loadElections();
    } catch (error) {
        console.error("Lỗi tạo cuộc bầu cử:", error);
        alert("Thao tác thất bại: " + (error.reason || error.shortMessage || error.message));
    } finally {
        btn.disabled = false;
        btn.textContent = "+ Tạo cuộc bầu cử";
    }
}

async function handleAddCandidate(event) {
    event.preventDefault();
    if (!votingContract) return alert("Vui lòng kết nối ví MetaMask!");

    const electionId = Number(document.getElementById("adminSelectElection").value);
    const name = document.getElementById("adminCandidateName").value.trim();
    const desc = document.getElementById("adminCandidateDesc").value.trim();
    const btn = document.getElementById("btnAddCandidate");

    if (!electionId) return alert("Vui lòng chọn cuộc bầu cử!");

    try {
        btn.disabled = true;
        btn.textContent = "Đang xác nhận trên MetaMask...";

        const tx = await votingContract.addCandidate(electionId, name, desc);
        btn.textContent = "Đang ghi lên Blockchain...";
        await tx.wait();

        alert(`Đã thêm ứng viên "${name}" thành công!`);
        document.getElementById("adminCandidateName").value = "";
        document.getElementById("adminCandidateDesc").value = "";
        await loadElections();
    } catch (error) {
        console.error("Lỗi thêm ứng viên:", error);
        alert("Thao tác thất bại: " + (error.reason || error.shortMessage || error.message));
    } finally {
        btn.disabled = false;
        btn.textContent = "+ Thêm ứng cử viên";
    }
}

async function handleToggleElectionStatus(isActive) {
    if (!votingContract) return alert("Vui lòng kết nối ví MetaMask!");

    const electionId = Number(document.getElementById("adminToggleSelectElection").value);
    if (!electionId) return alert("Vui lòng chọn cuộc bầu cử!");

    const election = electionsData.find((e) => e.id === electionId);
    if (election && election.isActive === isActive) {
        return alert(isActive ? "Cuộc bầu cử này đang mở sẵn rồi!" : "Cuộc bầu cử này đã bị khóa sẵn rồi!");
    }

    const btnLock = document.getElementById("btnLockElection");
    const btnUnlock = document.getElementById("btnUnlockElection");

    try {
        btnLock.disabled = true;
        btnUnlock.disabled = true;
        if (isActive) {
            btnUnlock.textContent = "Đang xử lý...";
        } else {
            btnLock.textContent = "Đang xử lý...";
        }

        const tx = await votingContract.setElectionStatus(electionId, isActive);
        await tx.wait();

        alert(isActive ? `Đã mở lại cuộc bầu cử #${electionId}!` : `Đã khóa cuộc bầu cử #${electionId}!`);
        await loadElections();
    } catch (error) {
        console.error("Lỗi thay đổi trạng thái cuộc bầu cử:", error);
        alert("Thao tác thất bại: " + (error.reason || error.shortMessage || error.message));
    } finally {
        btnLock.disabled = false;
        btnUnlock.disabled = false;
        btnLock.textContent = "🔒 Khóa bình chọn";
        btnUnlock.textContent = "🔓 Mở lại bình chọn";
    }
}

if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
        if (userAddress) {
            connectWallet();
        }
    });
    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
}