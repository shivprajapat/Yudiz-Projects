<div id="kt_header" class="header header-fixed">
    <div class="container-fluid d-flex align-items-stretch justify-content-between">


        <div class="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">
            <div id="kt_header_menu"
                class="header-menu header-menu-mobile header-menu-layout-default align-items-center justify-content-between">
                <div class="text-muted h4 mb-0">Sports Entertainment</div>
                {{-- <a href="{{ str_contains(url()->current(),'publisher') ? route('marketer.dashboard.index') : route('publisher.dashboard.index') }}" class="btn  btn-primary mx-3">{{str_contains(url()->current(),'publisher') ? 'Marketer' : 'Publisher'}}</a> --}}
                {{-- <ul class="nav menu-nav" id="myTab" role="tablist">
					<li class="menu-item  menu-item-submenu">
						<a class="nav-link {{ str_contains(url()->current(),'marketer') ? 'active' : ''}}"  href="{{ route('marketer.dashboard.index')}}"> --}}
                {{-- <span class="nav-icon">
								<i class="flaticon2-chat-1"></i>
							</span> --}}
                {{-- <span class="nav-text">Marketer</span>
						</a>
					</li>
					<li class="menu-item menu-item-submenu">
						<a class="nav-link {{ str_contains(url()->current(),'publisher') ? 'active' : ''}}"  href="{{ route('publisher.dashboard.index')}}"> --}}
                {{-- <span class="nav-icon">
								<i class="flaticon2-layers-1"></i>
							</span> --}}
                {{-- <span class="nav-text">Publisher</span>
						</a>
					</li>
				</ul> --}}
            </div>
        </div>
        <div class="topbar">
            <div class="dropdown">
                <div class="dropdown">
                    <div class="topbar-item">
                        <a class="btn btn-icon btn-clean  btn-lg mr-1" href="">
                            <span class="svg-icon svg-icon-xl svg-icon-primary">
                                <i class="fas fa-bell"></i>
                            </span>
                        </a>
                    </div>
                    <div class="topbar-item" data-toggle="dropdown" data-offset="10px,0px">
                        <div class="btn btn-icon btn-clean btn-dropdown w-auto align-items-center btn-lg mr-1 px-2">
                            {{-- <span class="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hi,</span> --}}
                            <span
                                class="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">{{ auth('coaching')->user()->email }}</span>
                            {{-- <span class="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">Test</span> --}}
                            <span class="symbol symbol-35 symbol-light-success">
                                <span class="symbol-label font-size-h5 font-weight-bold">
                                    {{-- "Image" --}}
                                    {{ implode('',array_map(function ($v) {return $v[0];}, explode(' ', auth('coaching')->user()->email))) }}
                                    {{-- T --}}

                                </span>
                            </span>
                            {{-- <span class="ml-3">
								<i class="fas fa-chevron-down"></i>
							</span> --}}
                        </div>
                    </div>


                    <div class="dropdown-menu p-0 m-0 dropdown-menu-anim-up dropdown-menu-md dropdown-menu-right">
                        <ul class="navi navi-hover py-4">
                            <li class="navi-item">
                                <a href=" {{ route('coaching.coachingDetails') }} " class="navi-link">
                                    <span class="symbol symbol-20 mr-3">
                                        <i class="fas fa-user-edit"></i>
                                    </span>
                                    <span class="navi-text">My Profile</span>
                                </a>
                            </li>

                            <li class="navi-item">
                                <a href="{{ route('coaching.changePassword') }}" class="navi-link">
                                    <span class="symbol symbol-20 mr-3">
                                        <i class="fa fa-key"></i>
                                    </span>
                                    <span class="navi-text">Change Password</span>
                                </a>
                            </li>


                            <li class="navi-item">
                                <a href="{{ route('coaching.logout') }}" class="navi-link">
                                    <span class="symbol symbol-20 mr-3">
                                        <i class="fas fa-stroopwafel"></i>
                                    </span>
                                    <span class="navi-text">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
