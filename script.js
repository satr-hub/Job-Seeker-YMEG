// Fungsi untuk menghasilkan opsi waktu dalam format dropdown
function generateTimeOptions(selectedTime = '') {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) { // Menggunakan interval 15 menit
            const time = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
            times.push(`<option value="${time}" ${time === selectedTime ? 'selected' : ''}>${time}</option>`);
        }
    }
    return times.join('');
}

// Inisialisasi dropdown waktu saat form baru dimuat
document.addEventListener('DOMContentLoaded', function() {
    const targetTimeDropdown = document.getElementById('target-time');
    targetTimeDropdown.innerHTML = generateTimeOptions(); // Muat opsi waktu saat halaman dimuat
});

// Fungsi untuk memuat pekerjaan yang tersimpan di Local Storage
function loadJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = ''; // Bersihkan tabel sebelum render ulang

    jobs.forEach((job, index) => {
        // Format Tanggal menjadi tanggal-bulan-tahun
        const formattedDate = new Date(job.date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const row = document.createElement('tr');

        row.innerHTML = `
            <td contenteditable="true" onblur="updateJob(${index}, 'jobType', this.innerText)">${job.jobType}</td>
            <td contenteditable="true" onblur="updateJob(${index}, 'vehicleType', this.innerText)">${job.vehicleType}</td>
            <td>${formattedDate}</td>
            <td>
                <select onchange="updateJob(${index}, 'targetTime', this.value)">
                    ${generateTimeOptions(job.targetTime)} <!-- Set value from job -->
                </select>
            </td>
            <td contenteditable="true" onblur="updateJob(${index}, 'realTime', this.innerText)">${job.realTime || '-'}</td>
            <td>
                <select onchange="updateJob(${index}, 'status', this.value)">
                    <option value="Belum Mulai" ${job.status === 'Belum Mulai' ? 'selected' : ''}>Belum Mulai</option>
                    <option value="Sedang Dikerjakan" ${job.status === 'Sedang Dikerjakan' ? 'selected' : ''}>Sedang Dikerjakan</option>
                    <option value="Selesai" ${job.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    <option value="Sudah di Video" ${job.status === 'Sudah di Video' ? 'selected' : ''}>Sudah di Video</option>
                </select>
            </td>
            <td contenteditable="true" onblur="updateJob(${index}, 'videographer', this.innerText)">${job.videographer || '-'}</td>
            <td>
                <button onclick="copyJob(${index})">Copy</button>
                <button onclick="deleteJob(${index})">Hapus</button>
                <button onclick="editJob(${index})">Edit</button>
            </td>
        `;

        jobList.appendChild(row);
    });
}

// Tambahkan event listener untuk form
document.getElementById('addJobForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah pengiriman form

    const jobType = document.getElementById('job-type').value;
    const jobTypeOther = document.getElementById('job-type-other').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    const date = document.getElementById('job-date').value;
    const targetTime = document.getElementById('target-time').value;
    const status = document.getElementById('job-status').value;
    const videographer = document.getElementById('videographer').value;

    const job = {
        jobType: jobType === 'Lainnya' ? jobTypeOther : jobType,
        vehicleType,
        date,
        targetTime,
        realTime: '', // Inisialisasi kolom Jam Realisasi dengan string kosong
        status,
        videographer
    };

    // Simpan ke Local Storage
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));

    loadJobs(); // Muat pekerjaan
    this.reset(); // Reset form

    // Reset dropdown untuk waktu
    document.getElementById('target-time').innerHTML = '<option value="">-</option>' + generateTimeOptions(); 
});

// Fungsi untuk mengupdate pekerjaan
function updateJob(index, key, value) {
    const jobs = JSON.parse(localStorage.getItem('jobs'));
    jobs[index][key] = value;
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

// Fungsi untuk menghapus pekerjaan
function deleteJob(index) {
    const jobs = JSON.parse(localStorage.getItem('jobs'));
    jobs.splice(index, 1);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    loadJobs(); // Muat pekerjaan
}

// Fungsi untuk menyalin pekerjaan
function copyJob(index) {
    const jobs = JSON.parse(localStorage.getItem('jobs'));
    const job = jobs[index];
    const newJob = { ...job }; // Buat salinan dari pekerjaan yang disalin
    const jobList = JSON.parse(localStorage.getItem('jobs')) || [];
    jobList.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobList));
    loadJobs(); // Muat pekerjaan
}

// Load jobs on page load
loadJobs();
