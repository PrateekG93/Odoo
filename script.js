new Vue({
    el: '#app',
    data: {
      currentView: 'login',
      username: '',
      authority: '',
      password: '',
      email: '',
      displayName: '',
      authorities: ['admin', 'examiner', 'invigilator'],
      examPapers: [],
      newFileName: '',
      selectedFile: null,
      editingFileId: null,
      currentUser: null,
      pendingRegistrations: []
    },
    methods: {
      showView(view) {
        this.currentView = view;
      },
      handleLogin() {
        if (this.username === 'admin' && this.password === 'admin' && this.authority === 'admin') {
          this.currentUser = { username: this.username, authority: this.authority };
          this.showView('admin');
        } else if (this.authority === 'examiner' && this.isExaminerApproved) {
          this.currentUser = { username: this.username, authority: this.authority };
          this.showView('examiner');
        } else if (this.authority === 'invigilator' && this.isInvigilatorApproved) {
          this.currentUser = { username: this.username, authority: this.authority };
          this.showView('invigilator');
        } else {
          alert('Invalid login credentials or pending approval');
        }
      },
      handleRegister() {
      
        this.pendingRegistrations.push({
          id: this.pendingRegistrations.length + 1,
          username: this.username,
          authority: this.authority
        });
        alert('Registration successful. Please wait for admin approval.');
        this.showView('login');
      },
      approveRegistration(id) {
        const registration = this.pendingRegistrations.find(r => r.id === id);
        if (registration) {
         
          alert(Approved registration for ${registration.username} as ${registration.authority});
          this.pendingRegistrations = this.pendingRegistrations.filter(r => r.id !== id);
        }
      },
      rejectRegistration(id) {
        
        this.pendingRegistrations = this.pendingRegistrations.filter(r => r.id !== id);
      },
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      uploadFile() {
        if (this.selectedFile && this.currentUser && this.currentUser.authority === 'admin') {
          this.examPapers.push({
            id: this.examPapers.length + 1,
            name: this.newFileName || this.selectedFile.name,
            path: URL.createObjectURL(this.selectedFile),
            authority: this.authority,
            editable: false
          });
          this.newFileName = '';
          this.selectedFile = null;
        }
      },
      editFile(paper) {
        if (this.currentUser && this.currentUser.authority === 'admin') {
          if (paper.editable) {
            this.editingFileId = null;
          } else {
            this.editingFileId = paper.id;
          }
          paper.editable = !paper.editable;
        }
      },
      deleteFile(id) {
        if (this.currentUser && this.currentUser.authority === 'admin') {
          this.examPapers = this.examPapers.filter(paper => paper.id !== id);
        }
      },
      handleViewEdit(path) {
        window.open(path, '_blank');
      },
      handleDownload(path) {
        window.open(path, '_blank');
      }
    },
    computed: {
      isExaminerApproved() {
        return this.pendingRegistrations.find(r => r.authority === 'examiner' && r.username === this.username) === undefined;
      },
      isInvigilatorApproved() {
        return this.pendingRegistrations.find(r => r.authority === 'invigilator' && r.username === this.username) === undefined;
      }
    },
    watch: {
      examPapers: {
        handler(newVal) {
          localStorage.setItem('examPapers', JSON.stringify(newVal));
        },
        deep: true
      },
      pendingRegistrations: {
        handler(newVal) {
          localStorage.setItem('pendingRegistrations', JSON.stringify(newVal));
        },
        deep: true
      }
    },
    created() {
      const storedPapers = localStorage.getItem('examPapers');
      if (storedPapers) {
        this.examPapers = JSON.parse(storedPapers).map(paper => ({
          ...paper,
          editable: false
        }));
      }
  
      const storedRegistrations = localStorage.getItem('pendingRegistrations');
      if (storedRegistrations) {
        this.pendingRegistrations = JSON.parse(storedRegistrations);
      }
    }
  });