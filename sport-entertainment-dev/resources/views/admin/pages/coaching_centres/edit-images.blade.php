@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('coaching-centres-images_update', $coaching_centre->id) !!}
@endpush
@push('extra-css')
    <style>
        .remove-img {
            position: absolute;
            top: 0.1px;
            right: 0.1px;
            margin-left: 10px;
            background-color: #fff; 
            /* padding: 0px; */
        }

        ,
    </style>
@endpush
@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{ $icon }} text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">{{ $custom_title }} Details</h3>
                </div>
                <div class="card-toolbar">
                    @if (in_array('delete', $permissions))
                        <a href="{{ route('admin.coaching-centres.perform-action', 0) }}" name="del_select" id="del_select"
                            data-action="delete_all"
                            class="btn btn-sm btn-light-danger font-weight-bolder text-uppercase mr-2 perform_action">
                            <i class="far fa-trash-alt"></i> Delete Selected
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.coaching-centres.perform-action', $coaching_centre->id) }}"
                            data-action="set_all_banner"
                            class="btn btn-sm btn-primary font-weight-bolder text-uppercase perform_action">
                            <i class="fa fa-image"></i>
                            Set As Banner
                        </a>
                    @endif
                </div>
            </div>
            <!--begin::Form-->
            <form id="frmEdiImages" method="POST"
                action="{{ route('admin.coaching-centres.upload-images', $coaching_centre->id) }}" enctype="multipart/form-data">
                @csrf
                <div class="card-body">

                    {{-- Images --}}
                    <div class="form-group">
                        <label for="images[]">Images (Multiple):</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="imageInput" name="images[]"
                                enctype="multipart/form-data" tabindex="0" multiple="multiple" accept="image/*" />
                            <input type="hidden" name="images[]" value="" />
                            <label class="custom-file-label @error('images[]') is-invalid @enderror" for="customFile">Choose
                                file</label>
                            @if ($errors->has('images[]'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('images[]') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="form-group" id="div-image">
                        <div class="row">
                            <div class="col-md-12">
                                <label>
                                    <h4>Banner Images</h4>
                                </label>
                                <div>
                                    <label class="text-success ml-2" id="updating" style="display:none;">Updating
                                        ...</label>
                                </div>

                                <label class="text-danger">Note : </label>
                                <ol class="dd-list sortable_list1" id="sortable_list1"
                                    style="overflow:hidden; padding: 0px;">
                                    @foreach ($coaching_centre->coachingCentreImages as $image)
                                        @if ($image->image_path && $image->is_banner == 1)
                                            <li class="dd-item dd3-item" style="display:inline-block; margin: 10px; ">
                                                <div class="symbol symbol-120 mb-10">
                                                    <a href="{{ Storage::url($image->image_path) }}" target="_blank"><img
                                                            style="height:150px; width:150px"
                                                            src="{{ Storage::url($image->image_path) }}"></a>
                                                    {{-- <a href="#" data-id="{{ $image->id }}"
                                                        class="btn btn-icon btn-light btn-hover-danger remove-img"
                                                        id="kt_quick_user_close" style="width: 18px; height: 18px;">
                                                        <i class="fa fa-check icon-xs text-muted"
                                                            data-id="{{ $image->id }}"></i> --}}
                                                    {{-- ki-close --}}
                                                    {{-- </a> --}}
                                                    <input type="checkbox" class="image-checkbox"
                                                        data-id="{{ $image->id }}" value="{{ $image->id }}"
                                                        style="position: absolute; top: 0px; right: 0px;">

                                                    {{-- <input type="hidden" name="images[]" value="" /> --}}
                                                </div>
                                            </li>
                                        @endif
                                    @endforeach
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="div-image">
                        <div class="row">
                            <div class="col-md-12">
                                <div>
                                    <label>
                                        <h4>Images</h4>
                                    </label>
                                    <label class="text-success ml-2" id="updating" style="display:none;">Updating
                                        ...</label>
                                </div>

                                <label class="text-danger">Note : </label>
                                <ol class="dd-list" id="sortable_list" style="overflow:hidden; padding: 0px;">
                                    @foreach ($coaching_centre->coachingCentreImages as $image)
                                        @if ($image->image_path && $image->is_banner == 0)
                                            <li class="dd-item dd3-item" style="display:inline-block; margin: 10px; ">
                                                <div class="symbol symbol-120 mb-10">
                                                    <a href="{{ Storage::url($image->image_path) }}" target="_blank"><img
                                                            style="height:100px; width:100px"
                                                            src="{{ Storage::url($image->image_path) }}"></a>
                                                    {{-- <a href="#" data-id="{{ $image->id }}"
                                                        class="btn btn-icon btn-light btn-hover-danger remove-img"
                                                        id="kt_quick_user_close" style="width: 18px; height: 18px;">
                                                        <i class="fa fa-check icon-xs text-muted"
                                                            data-id="{{ $image->id }}"></i> --}}
                                                    {{-- ki-close --}}
                                                    {{-- </a> --}}
                                                    <input type="checkbox" class="image-checkbox"
                                                        data-id="{{ $image->id }}" value="{{ $image->id }}"
                                                        style="position: absolute; top: 0px; right: 0px;">

                                                    {{-- <input type="hidden" name="images[]" value="" /> --}}
                                                </div>
                                            </li>
                                        @endif
                                    @endforeach
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                    <a href="{{ route('admin.coaching-centres.edit',$coaching_centre->id) }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
@push('extra-js')
    <script>
        $(document).ready(function() {
            var newImages = [];
            var uploadedImages = [];
            var csrfToken = $('meta[name="csrf-token"]').attr('content');

            // Add Image
            $("#imageInput").on('change', function() {
                event.preventDefault();
                var files = $(this)[0].files;
                var formData = new FormData();
                // var photo = $(this).prop('files')[0];

                for (var i = 0; i < files.length; i++) {
                    formData.append('images[]', files[i]);
                    loadImage(files[i]);
                }

                function loadImage(path) {
                    console.log(path);
                    var reader = new FileReader();
                    reader.onload = function(path) {
                        var img = path.target.result;
                        console.log(img);

                        var listItem = $(
                            '<li class="dd-item dd3-item" style="display:inline-block; margin:10px;">' +
                            '<div class="symbol symbol-120 mb-10">' +
                            '<a href="' + img +
                            '" target="_blank"><img style="height:100px; width:100px" src="' +
                            img + '"></a>' +
                            '</li>');

                        $('#sortable_list').append(listItem);
                    }
                    reader.readAsDataURL(files[i]);
                }
            });
            $(document).on("click", ".perform_action", function(e) {
                $(".perform_action").attr("disabled", "disabled");
                e.preventDefault();
                var url = $(this).attr("href");
                var action = $(this).data("action");
                var selectedImages = [];
                var totalBanners = {!! json_encode($total_banners) !!};
                var checkboxes = $(".sortable_list1  input[class='image-checkbox']");
                var checkedCheckboxes = checkboxes.filter(":checked");

                $(".dd-list input[class='image-checkbox']:checked").each(
                    function() {
                        selectedImages.push($(this).val());
                    }
                );
                if (selectedImages.length > 0) {
                    var ids = selectedImages.join();
                    var confirmTitle;
                    var confirmText;
                    var confirmIcon;
                    var showCancel;
                    var confirmButtonTxt;
                    var showConfirm = false;
                    if (action == 'set_all_banner') {
                        if (checkedCheckboxes.length >= 1) {
                            confirmTitle = "Oops!";
                            confirmText = "Some images are already selected as banner!";
                            confirmIcon = "warning";
                            showCancel = false;
                            showConfirm = false;
                            confirmButtonTxt = "Yes";
                        } else if (totalBanners >= 10 || ($(
                                ".dd-list input[class='image-checkbox']:checked").length + totalBanners) >
                            10) {
                            confirmTitle = "Oops!";
                            confirmText = "You can not set more than 10 banner images!";
                            confirmIcon = "warning";
                            showCancel = false;
                            showConfirm = false;
                            confirmButtonTxt = "Yes";
                        } else {
                            confirmTitle = "Are you sure?";
                            confirmText = "You want to add this image as a banner!";
                            confirmIcon = "warning";
                            showCancel = true;
                            showConfirm = true;
                            confirmButtonTxt = "Yes";
                        }
                    } else {
                        if (totalBanners <= 1 || checkboxes.length === checkedCheckboxes.length) {
                            confirmTitle = "Oops!";
                            confirmText = "At least 1 banner image is required!";
                            confirmIcon = "warning";
                            showCancel = false;
                            showConfirm = false;
                            confirmButtonTxt = "Yes";
                        } else {
                            confirmTitle = "Are you sure?";
                            confirmText = "You want to delete these images!";
                            confirmIcon = "warning";
                            showCancel = true;
                            showConfirm = true;
                            confirmButtonTxt = "Yes";
                        }
                    }
                    Swal.fire({
                        title: confirmTitle,
                        text: confirmText,
                        icon: confirmIcon,
                        showCancelButton: showCancel,
                        showConfirmButton: showConfirm,
                        confirmButtonText: confirmButtonTxt,
                    }).then(function(result) {
                        if (result.value) {
                            $.ajax({
                                url: url,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    action: action,
                                    ids: ids,
                                    _token: $('meta[name="csrf_token"]').attr(
                                        "content"
                                    ),
                                },
                                success: function(response) {

                                    $(".delete_all_link").removeAttr("disabled");
                                    if (response.action == 'delete_all')
                                        Swal.fire({
                                            title: "Deleted!",
                                            icon: "success",
                                            text: "Records was deleted.",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    else {
                                        Swal.fire({
                                            title: "Set!",
                                            icon: "success",
                                            text: "Successfully set as banner.",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    }
                                    location.reload(true)
                                },
                            });

                        } else {
                            $(".image-checkbox").prop('checked', false);
                        }
                    });
                } else {
                    $(".image-checkbox").prop('checked', false);
                    $(".delete_all_link").removeAttr("disabled");
                }
            });
        });
    </script>
@endpush
