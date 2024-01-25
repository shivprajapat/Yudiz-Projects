<div class="aside aside-left aside-fixed d-flex flex-column flex-row-auto" id="kt_aside">
	<!--begin::Brand-->
	<div class="brand flex-column-auto" id="kt_brand">
		<!--begin::Logo-->
		<a href="{{ route('admin.dashboard.index') }}" class="brand-logo">
			<img style="max-width: 100px; max-height: 50px; position: absolute; vertical-align: middle; margin: -19px 15px 15px 30px;" alt="{{ env('APP_NAME') }}" src="{{ $sitesetting['site_logo'] ? generate_url($sitesetting['site_logo']) : asset('frontend/images/logo.png') }}" />
		</a>
		<!--end::Logo-->
		<!--begin::Toggle-->
		<button class="brand-toggle btn btn-sm px-0" id="kt_aside_toggle">
			<span class="svg-icon svg-icon svg-icon-xl">
				<!--begin::Svg Icon | path:assets/media/svg/icons/Navigation/Angle-double-left.svg-->
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
					<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<polygon points="0 0 24 0 24 24 0 24" />
						<path d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z" fill="#000000" fill-rule="nonzero" transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999)" />
						<path d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999)" />
					</g>
				</svg>
				<!--end::Svg Icon-->
			</span>
		</button>
		<!--end::Toolbar-->
	</div>
	<!--end::Brand-->
	<!--begin::Aside Menu-->
	<div class="aside-menu-wrapper flex-column-fluid" id="kt_aside_menu_wrapper">
		<!--begin::Menu Container-->
		<div id="kt_aside_menu" class="aside-menu my-4" data-menu-vertical="1" data-menu-scroll="1" data-menu-dropdown-timeout="500">

			<!--begin::Searchbox-->
			<link rel="stylesheet" href="//static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.min.css" />
        	<link rel="stylesheet" href="//static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.components.min.css" />

	        <div class="ms-SearchBox">
	          <input class="ms-SearchBox-field" type="text" value="" id="search" style="width: 265px;" autocomplete="off" spellcheck="false" autocapitalize="off" autocorrect="off" dir="ltr" />
	          <label class="ms-SearchBox-label">
	            <i class="ms-SearchBox-icon ms-Icon ms-Icon--Search"></i>
	          </label>
	        </div>

			<!--end::Searchbox-->

			<!--begin::Menu Nav-->
			<ul class="menu-nav">
				{{-- Dashboard Section Start --}}

				{{--  {{ dd($menu) }}  --}}
				@foreach ($menu as  $section)
					{{--  If having sub menus  --}}
					@if( count($section['roles']) > 1 )

                    @php
                        $activeSubmenu = '';
                        //Any Submenu Selected Open Parent Menu
                        foreach ($section['roles'] as $role){
                            !empty($role['class']) ? $activeSubmenu = 'menu-item-open' : '';
                        }
                    @endphp
						<li class="menu-item menu-item-submenu side-item {{$activeSubmenu}}" data-title="'.{{strtolower( $section['name'] )}}.'" aria-haspopup="true" data-menu-toggle="hover">
							<a href="javascript:;" class="menu-link menu-toggle">
								@if( $section['icon_type'] == 'image' )
									<img class="menu-icon" src="#" alt="{{ str_slug($section['name']) }}">
                            	@else
								<i class="menu-icon {{ $section['icon'] }}"></i>
								@endif
								<span class="menu-text">{{ $section['name'] }}</span>
								<i class="menu-arrow"></i>
							</a>
							<div class="menu-submenu">
								<i class="menu-arrow"></i>
								<ul class="menu-subnav">
                                    <li class="menu-item menu-item-parent" aria-haspopup="true">
                                        <span class="menu-link">
                                            <span class="menu-text">{{ $section['name'] }}</span>
                                        </span>
                                    </li>
									@foreach ($section['roles'] as $role)
										<li class="menu-item {{ $role['class'] }}" aria-haspopup="true" >
                                                    <a href="{{ (!empty($role['params'])) ? route($role['route'], $role['params']) : route($role['route']) }}" class="menu-link">
												@if( $role['icon_type'] == 'image' )
                                            		<img class="menu-icon" src="#" alt="{{ str_slug($role['title']) }}">
                                        		@else
													<i class="menu-icon {{ $role['icon'] }}"><span></span></i>
												@endif
												<span class="menu-text">{{ $role['title']  }}</span>
											</a>
										</li>
									@endforeach

								</ul>
							</div>
						</li>

					@else

						@php
                        	$menu = reset($section['roles'])
                    	@endphp

						{{--  If having only single menus  --}}
						<li class="menu-item side-item {{ $menu['class'] }}" aria-haspopup="true" data-title="'.{{strtolower( $menu['title'] )}}.'">
							<a href="{{ (!empty($menu['params'])) ? route($menu['route'], $menu['params']) : route($menu['route']) }}" class="menu-link">
								@if( $menu['icon_type'] == 'image' )
                                	<img class="menu-icon" alt="{{ str_slug($menu['title']) }}">
                            	@else
									<i class="menu-icon {{ $menu['icon'] }}"></i>
								@endif
								<span class="menu-text">{{ $menu['title'] }}</span>
							</a>
						</li>
					@endif
				@endforeach

			</ul>
			<!--end::Menu Nav-->
		</div>
		<!--end::Menu Container-->
	</div>
	<!--end::Aside Menu-->
</div>



@push('extra-js')

<script type="text/javascript">
    $(document).ready(function(){
        $("#search").keyup(function(){
            var val = $(this).val().toLowerCase();
            // console.log(val);
            if(val == ""){
                $(".menu-nav li.side-item").show();
            }
            else
            {
                $(".menu-nav li.side-item").hide();
                $(".menu-nav li[data-title*="+val+"]").show();
            }
        });
    });
</script>
@endpush
