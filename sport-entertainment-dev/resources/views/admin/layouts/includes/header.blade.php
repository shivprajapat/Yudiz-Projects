<div id="kt_header" class="header header-fixed">
	<div class="container-fluid d-flex align-items-stretch justify-content-between">
		<div class="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">
			@if(count(auth()->user()->quickLinks) > 0)
				<div id="kt_header_menu" class="header-menu header-menu-mobile header-menu-layout-default">
					<ul class="menu-nav">
						<li class="menu-item menu-item-open menu-item-here menu-item-submenu menu-item-rel menu-item-open menu-item-here" data-menu-toggle="click" aria-haspopup="true">
							<a href="javascript:;" class="menu-link menu-toggle">
								<span class="menu-text">Quick Links</span>
								<i class="menu-arrow"></i>
							</a>
							<div class="menu-submenu menu-submenu-classic menu-submenu-left" >
								<ul class="menu-subnav" data-wheel-propagation="true" data-scroll="true"  style="max-height:500px">
									@foreach(auth()->user()->quickLinks as $quickLink)
										@foreach ( explode(',',$quickLink->link_type) as $link_type)
										@php
                                            if($link_type == 'index'){
                                                $menuText = $quickLink->role->title;
                                                $route = route($quickLink->role->route);
                                            } else {
                                                $menuText = "Add ".str_singular($quickLink->role->title);
                                                $routeName = substr($quickLink->role->route, 0, strrpos($quickLink->role->route, '.'));
                                                $route = route($routeName.'.'.$link_type);
                                            }
										@endphp
										<li class="menu-item" aria-haspopup="true">
											<a href="{{ $route }}" class="menu-link">
												<i class="menu-bullet menu-bullet-dot"><span></span></i>
												<span class="menu-text"> {{$menuText}}</span>
											</a>
										</li>
										@endforeach
									@endforeach
								</ul>
							</div>
						</li>
					</ul>
				</div>
			@endif
		</div>
		<div class="topbar">
			<div class="dropdown">
				<div class="dropdown">
					<div class="topbar-item" data-toggle="dropdown" data-offset="10px,0px">
						<div class="btn btn-icon btn-clean btn-dropdown w-auto align-items-center btn-lg mr-1 px-2">
							<span class="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hi,</span>
							<span class="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">{{ Auth::user()->full_name }}</span>
							<span class="symbol symbol-35 symbol-light-success">
								<span class="symbol-label font-size-h5 font-weight-bold">
									{{ implode('', array_map(function($v) { return $v[0]; }, explode(' ', Auth::user()->full_name))) }}
								</span>
							</span>
						</div>
					</div>

					<div class="dropdown-menu p-0 m-0 dropdown-menu-anim-up dropdown-menu-md dropdown-menu-right">
						<ul class="navi navi-hover py-4">
							<li class="navi-item">
							<a href="{{ route('admin.profile')}}" class="navi-link">
									<span class="symbol symbol-20 mr-3">
									<i class="far fa-user"></i>
									</span>
									<span class="navi-text">Manage Account</span>
								</a>
							</li>

							<li class="navi-item">
								<a href="{{ route('admin.quickLink')}}" class="navi-link">
									<span class="symbol symbol-20 mr-3">
										<i class="fas fa-link"></i>
									</span>
									<span class="navi-text">Manage Quick Links</span>
								</a>
							</li>

							<li class="navi-item">
								<a href="{{ route('admin.logout') }}" class="navi-link" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
									<span class="symbol symbol-20 mr-3">
										<i class="fas fa-sign-out-alt"></i>
									</span>
									<span class="navi-text">Logout</span>
								</a>
                                <form id="logout-form" action="{{ route('admin.logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
