import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import { Route, Navigate, Routes } from 'react-router-dom'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import service from '../../api/request'
import { connect } from 'react-redux'
import { Spin } from 'antd'

const LocalRouterMap = {
  '/home': <Home />,
  '/user-manage/list': <UserList />,
  '/right-manage/role/list': <RoleList />,
  '/right-manage/right/list': <RightList />,
  '/news-manage/add': <NewsAdd />,
  '/news-manage/draft': <NewsDraft />,
  '/news-manage/category': <NewsCategory />,
  '/news-manage/preview/:id': <NewsPreview />,
  '/news-manage/update/:id': <NewsUpdate />,
  '/audit-manage/audit': <Audit />,
  '/audit-manage/list': <AuditList />,
  '/publish-manage/unpublished': <Unpublished />,
  '/publish-manage/published': <Published />,
  '/publish-manage/sunset': <Sunset />,
}

function NewsRouter(props) {
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([service.get('/rights'), service.get('/children')]).then(
      (res) => {
        // console.log([...res[0].data, ...res[1].data])
        setBackRouteList([...res[0].data, ...res[1].data])
        // console.log(BackRouteList);
      }
    )
  }, [])

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'))

  const checkRoute = (item) => {
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    )
  }

  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
    <Spin size="large" spinning={props.isLoading}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        {BackRouteList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                element={LocalRouterMap[item.key]}
              />
            )
          }
          return null
        })}
        {BackRouteList.length > 0 && (
          <Route path="*" element={<Nopermission />} />
        )}
      </Routes>
    </Spin>
  )
}

const mapStateToProps = ({LoadingReducer:{isLoading}})=>({
  isLoading
})


export default connect(mapStateToProps)(NewsRouter)