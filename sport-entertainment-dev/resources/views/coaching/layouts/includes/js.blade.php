{{-- Global Config(global config for global JS scripts) Start --}}
<script>
    var HOST_URL = "https://keenthemes.com/metronic/tools/preview";
</script>
<script>
    var KTAppSettings = {
        "breakpoints": {
            "sm": 576,
            "md": 768,
            "lg": 992,
            "xl": 1200,
            "xxl": 1400
        },
        "colors": {
            "theme": {
                "base": {
                    "white": "#ffffff",
                    "primary": "#3699FF",
                    "secondary": "#E5EAEE",
                    "success": "#1BC5BD",
                    "info": "#8950FC",
                    "warning": "#FFA800",
                    "danger": "#F64E60",
                    "light": "#E4E6EF",
                    "dark": "#181C32"
                },
                "light": {
                    "white": "#ffffff",
                    "primary": "#E1F0FF",
                    "secondary": "#EBEDF3",
                    "success": "#C9F7F5",
                    "info": "#EEE5FF",
                    "warning": "#FFF4DE",
                    "danger": "#FFE2E5",
                    "light": "#F3F6F9",
                    "dark": "#D6D6E0"
                },
                "inverse": {
                    "white": "#ffffff",
                    "primary": "#ffffff",
                    "secondary": "#3F4254",
                    "success": "#ffffff",
                    "info": "#ffffff",
                    "warning": "#ffffff",
                    "danger": "#ffffff",
                    "light": "#464E5F",
                    "dark": "#ffffff"
                }
            },
            "gray": {
                "gray-100": "#F3F6F9",
                "gray-200": "#EBEDF3",
                "gray-300": "#E4E6EF",
                "gray-400": "#D1D3E0",
                "gray-500": "#B5B5C3",
                "gray-600": "#7E8299",
                "gray-700": "#5E6278",
                "gray-800": "#3F4254",
                "gray-900": "#181C32"
            }
        },
        "font-family": "Poppins"
    };
</script>
{{-- Global Config(global config for global JS scripts) End --}}

<script>
    var HOST_URL = "https://keenthemes.com/metronic/tools/preview";
</script>


{{-- Global Theme Bundle(used by all pages) Start --}}
<script src="{{ asset('assets/plugins/global/plugins.bundle.js') }}"></script>
<script src="{{ asset('assets/plugins/custom/prismjs/prismjs.bundle.js') }}"></script>
<script src="{{ asset('assets/js/scripts.bundle.js') }}"></script>

<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
<!-- <script src="{{ asset('assets/js/pages/crud/datatables/basic/paginations.js') }}"></script> -->
{{-- Global Theme Bundle(used by all pages) End --}}

{{-- Page Vendors(used by this page) Start --}}
<!-- <script src="{{ asset('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js') }}"></script> -->
{{-- Page Vendors(used by this page) End --}}

{{-- Page Scripts(used by this page) Start --}}
<script src="{{ asset('assets/js/pages/widgets.js') }}"></script>
{{-- Page Scripts(used by this page) End --}}


{{-- Validation js --}}
<script src="{{ asset('assets/admin/plugins/jquery-validation/js/jquery.validate.min.js') }}" type="text/javascript">
</script>
<script src="{{ asset('assets/admin/plugins/jquery-validation/js/additional-methods.js') }}" type="text/javascript">
</script>
<script src="{{ asset('assets/admin/js/custom_validations.js') }}" type="text/javascript"></script>

<script src="{{ asset('assets/admin/plugins/bootbox/bootbox.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('assets/admin/plugins/bootstrap-switch/js/bootstrap-switch.min.js') }}" type="text/javascript">
</script>

<!-- socket.io js  -->

<!-- custom js  -->
<script src="{{ asset('frontend/coaching/js/custom.js') }}" type="text/javascript"></script>

<script>
    var oTable;
</script>
