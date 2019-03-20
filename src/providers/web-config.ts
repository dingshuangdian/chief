import { Injectable } from '@angular/core';
import { ENV } from '@env/environment';
@Injectable()
export class WebConfig {
        /**
         * test
         */
        // static img_path = "http://cxc.chiefchain.cn/";
        // static server_ = "https://cptt.chiefchain.cn/mnt";
        // static qiniuServe = "https://upload-z2.qbox.me";
        /**
         * prod
         */
        // static img_path = "http://cxc.chiefchain.cn/";
        // static server_ = "https://ndmapp.chiefchain.cn/mnt";
        // static qiniuServe = "https://upload-z2.qbox.me";
        static img_path = ENV.img_path;
        static server_ = ENV.server_url;
        static sercer_1="http://ibs.chiefchain.com:9080/ChiefOSS";
        static img_path1="http://ibs.chiefchain.com:9080/OSS";
        static qiniuServe = ENV.qiniuServe_url;
        static API: any = {
                login: '/CRUD/CRUD-CQ-user-login.do',
                getUserInfo: '/CRUD/CRUD-Q-user-getCurrentUser.do',
                saveAsorder: '/CRUD/CRUD-U-asorder-saveAsorder.do', //下单
                findMemberAuto: '/CRUD/CRUD-Q-member-findMemberAuto.do', //搜索客户
                findMcard4keywords: '/CRUD/CRUD-Q-card-findMcard4keywords.do',//查询会员卡
                findmember: '/CRUD/CRUD-Q-member-findmember.do',//获取客户信息
                findService4Order: '/CRUD/CRUD-Q-service-findService4Order.do', //接车项目 (获取全部)
                findCustomService4Order: '/CRUD/CRUD-Q-service-findCustomService4Order.do',//自定义接车项目
                findWashCarService4Order: '/CRUD/CRUD-Q-service-findWashCarService4Order.do',
                findAllStoreUser: '/CRUD/CRUD-Q-user-findAllStoreUser.do', //查询该公司所有商家用户
                findStoreExt: '/CRUD/CRUD-Q-common-findStoreExt.do',
                findProductByName: '/CRUD/CRUD-Q-goods-findProductByName.do',
                findGoodsByCategoryId: '/CRUD/CRUD-Q-goods-findGoodsByCategoryId.do',
                findCategoryList: '/CRUD/CRUD-Q-goods-findCategoryList.do ',
                findmcardDiscount: '/CRUD/CRUD-Q-card-findmcardDiscount.do',
                findServiceTypeTree: '/CRUD/CRUD-Q-service-findServiceTypeTree.do',//获取服务分类
                findAutomake: '/CRUD/CRUD-Q-auto-findAutomake.do', //车型
                findAutomodel: '/CRUD/CRUD-Q-auto-findAutomodel.do',
                findAutotype: '/CRUD/CRUD-Q-auto-findAutotype.do',
                findAutoByAutoId: '/CRUD/CRUD-Q-auto-findAutoByAutoId.do',//查询车辆信息
                updateAutoInfo: '/CRUD/CRUD-U-auto-updateAutoInfo.do',//更新车辆信息
                findAsorderByOrderId: '/CRUD/CRUD-Q-asorder-findAsorderByOrderId.do',//查询订单详情
                saveAuto: '/CRUD/CRUD-U-auto-saveAuto.do',
                findOrderInfoByAutoId: '/CRUD/CRUD-Q-member-findOrderInfoByAutoId.do',
                findOrderInfoByAutoId_: '/CRUD/CRUD-Q-asorder-findOrderInfoByAutoId.do',
                getMemberDetailedByTel: '/CRUD/CRUD-Q-member-getMemberDetailedByTel.do',
                getMemberDetailedByPlateNumber: '/CRUD/CRUD-Q-member-getMemberDetailedByPlateNumber.do',
                updateAutoMerge: '/CRUD/CRUD-U-auto-updateAutoMerge.do',
                getMemberMessages: '/CRUD/CRUD-Q-member-getMemberMessages.do',
                updateMemberMerge: '/CRUD/CRUD-U-member-updateMemberMerge.do',
                findOrderLogsBymember: '/CRUD/CRUD/CRUD-Q-serviceOrder-findOrderLogsBymember.do',
                findSuspendedMoneyByMemberId: '/CRUD/CRUD-Q-member-findSuspendedMoneyByMemberId.do',//挂账
                findAutoMemosByAutoId: '/CRUD/CRUD-Q-auto-findAutoMemosByAutoId.do',//获取跟进信息
                addAutoMemo: '/CRUD/CRUD-U-auto-addAutoMemo.do',//添加跟进信息
                updateAutoMemo: '/CRUD/CRUD-U-auto-updateAutoMemo.do',//修改跟进信息
                updateAutoHandleResult: '/CRUD/CRUD-U-auto-updateAutoHandleResult.do',//处理跟进信息
                saveMember: '/CRUD/CRUD-Q-member-saveMember.do',
                findmcardtmpls4salecard: "/CRUD/CRUD-Q-card-findmcardtmpls4salecard.do",//获取卡模板列表
                findPaymentAndCard: "/CRUD/CRUD-Q-common-findPaymentAndCard.do",
                findmemberCard: '/CRUD/CRUD-Q-mcard-findmemberCard.do',
                orderList: '/CRUD/CRUD-Q-asorder-findAsorders.do',//订单列表
                cansolOrder: '/CRUD/CRUD-U-asorder-cancelAsorder.do',//取消订单
                susupendOrder: '/CRUD//CRUD/CRUD-U-asorder-susupendAsorder.do',//挂起订单 param:{orderId:orderId}
                accountOrder: '/CRUD/CRUD-Q-asorder-findOrder4settlement.do',//结算接口 param:{orderId:orderId}
                findOrderLogs: '/CRUD/CRUD-Q-asorder-findOrderLogs.do',
                susupendedAsorder: '/CRUD/CRUD-CU-asorder-susupendedAsorder.do',//挂账接口
                settlementAsorder: '/CRUD/CRUD-CU-asorder-settlementAsorder.do',//结算接口
                cancelpaid: '/CRUD/CRUD-U-order-cancelpaid.do',//撤销支付接口
                findmcardtmpl: '/CRUD/CRUD-Q-card-findmcardtmpl.do',
                findOrderById: '/CRUD/CRUD-Q-asorder-findOrderById.do',//订单详情
                addCard: "/CRUD/CRUD-CU-card-addCard.do",
                findOrderCopyLogs: '/CRUD/CRUD-Q-asorder-findOrderCopyLogs.do',
                findBookOrders: '/CRUD/CRUD-Q-bookorder-findBookOrders.do',
                getBookOrder: "/CRUD/CRUD-Q-bookOrder-getBookOrder.do",
                findMcardById: '/CRUD/CRUD-Q-mcmodify-findMcardById.do',
                rechargeMcard: '/CRUD/CRUD-U-card-rechargeMcard.do',
                findJournals: '/CRUD/CRUD-Q-Journal-findJournals.do',
                findSingleBillType: '/CRUD/CRUD-Q-singleBill-findSingleBillType.do',
                finddaysReport: '/CRUD/CRUD-Q-finances-finddaysReport.do?',//营收日报
                findyearReport: '/CRUD/CRUD-Q-finances-findyearReport.do',//营收年报
                findmonthReport: '/CRUD/CRUD-Q-finances-findmonthReport.do',//营收月报
                findBalanceReports4Month: '/CRUD/CRUD-Q-finances-findBalanceReports4Month.do',//收支30天
                findBalanceReports4Year: '/CRUD/CRUD-Q-finances-findBalanceReports4Year.do',//收支半年
                findDayBalanceReport: '/CRUD/CRUD-Q-finances-findDayBalanceReport.do',//收支单日
                findPmbdReport: '/CRUD/CRUD-Q-pmBonuscDistribute-findPmbdReport.do',
                addJournal: '/CRUD/CRUD-Q-Journal-addJournal.do',
                getTodayIncrement: '/CRUD/CRUD-Q-storeInfo-getTodayIncrement.do',
                getStoreInfo: '/CRUD/CRUD-Q-storeInfo-getStoreInfo.do',
                getBookOrdersCount: '/CRUD/CRUD-Q-bookorder-getBookOrdersCount.do',
                //findPermissionCode: "/CRUD/CRUD-Q-common-findPermissionCode.do", 
                findPermissionCode: "/CRUD/CRUD-Q-Auth-qryMenuFuncTags.do",
                loginOut: "/CRUD/CRUD-CQ-user-loginOut.do",
                getIOSVersion: "/CRUD/CRUD-Q-system-getIOSVersion.do",
                getAndroidVersion: '/CRUD//CRUD-Q-system-getAndroidVersion.do',
                InsuranceQryInfo: '/CRUD/CRUD-Q-IBS-Insurance-qryInfo.do',

                uploadImg: '/CRUD/CRUD-Q-upload-uploadImg.do',
                qiniuToken: '/CRUD/CRUD-Q-upload-qiniuToken.do',
                updateAutoImage: '/CRUD/CRUD-U-auto-updateAutoImage.do ',
                deleteAutoImage: '/CRUD/CRUD-U-auto-deleteAutoImage.do',
                findautomakes: "/CRUD/CRUD-Q-auto-findautomakes.do",
                findautomodels: "/CRUD/CRUD-Q-auto-findautomodels.do",
                findautotypes: "/CRUD/CRUD-Q-auto-findautotypes.do",
                findautotypeKeyword: "/CRUD/CRUD-Q-auto-findautotypeKeyword.do",
                findMember4plateNumber: '/CRUD/CRUD-Q-member-findMember4plateNumber.do',
                findGoods4keyWords: '/CRUD/CRUD-Q-goods-findGoods4keyWords.do',
                findDepartments: '/CRUD/CRUD-Q-department-findDepartments.do',
                changeDepartment: '/CRUD/CRUD-U-department-changeDepartment.do',
                //查询所有品牌信息
                findBrandList: '/CRUD/CRUD-Q-goods-findBrandListByPage.do',
                //查询商家仓库信息
                findWareHousesInfo: '/CRUD/CRUD-Q-CM-stock-findWareHousesInfo.do',
                //查询产品信息
                findStocksInfo4Phone: '/CRUD/CRUD-Q-stock-findStocksInfo4Phone.do',

                //车险
                getExpireInsuranceList: '/CRUD/CRUD-Q-IBS-Insurance-getExpireInsuranceList.do',
                //获取未读消息
                queryUnreadMsg: "/CRUD/CRUD-Q-Msg-queryUnreadMsg.auth",
                //获取城市列表
                getCityList: "/CRUD/CRUD-Q-IBS-Public-getCityList.do",
                //获取默认城市
                setDefaultAddress: "/CRUD/CRUD-Q-IBS-Public-setDefaultAddress.do",
                //获取车牌简称
                getLicenseplateShort: "/CRUD/CRUD-Q-IBS-Public-getLicenseplateShort.do",

                //获取保险公司列表
                getInsuranceComList: "/CRUD/CRUD-Q-IBS-Insurance-getInsuranceComList.do",

                //获取消息列表
                getMsgList: "/CRUD/CRUD-Q-Msg-getMsgList.do",
                //消息状态更改
                updateMsgStatus: "/CRUD/CRUD-U-Msg-updateMsgStatus.do",
                //获取证件信息
                getIDCardtype: "/CRUD/CRUD-Q-IBS-Public-getIDCardtype.do",
                //获取保险金额信息
                getInsureenumval: "/CRUD/CRUD-Q-IBS-Public-getInsureenumval.do",
                //获取单位个人信息
                getHolderPartytype: "/CRUD/CRUD-Q-IBS-Public-getHolderPartytype.do",
                //获取跟进人员列表
                getInsureAgentUList: "/CRUD/CRUD-Q-IBS-Insurance-getInsureAgentUList.do",
                //获取保单详情
                qryOrderInfo: '/CRUD/CRUD-Q-IBS-Order-qryOrderInfo.do',
                //获取上一年续保信息
                getInsuranceInfo: '/CRUD/CRUD-Q-IBS-Insurance-getInsuranceInfo.do',
                //获取保险公司列表
                getInsuranceCompanies: '/CRUD/CRUD-Q-IBS-Public-getInsuranceCompanies.do',
                //人工报价
                artificialQuotation: '/CRUD/CRUD-U-IBS-Insurance-artificialQuotation.do',
                //修改订单
                modifyInscuranceOrder: '/CRUD/CRUD-U-IBS-Order-modifyInscuranceOrder.do',
                //自动报价
                AutoQuotation: '/CRUD/CRUD-U-IBS-Insurance-AutoQuotation.do',
                //获取车辆报价信息
                getQuoteInfo: '/CRUD/CRUD-U-IBS-Insurance-getQuoteInfo.do',
                //获取车辆核保信息
                getQuoteSubmitInfo: '/CRUD/CRUD-U-IBS-Insurance-getQuoteSubmitInfo.do',
                qryBackOrder: '/CRUD/CRUD-Q-IBS-Order-qryBackOrder.do',//已退回
                qryUnderwritingOrder: '/CRUD/CRUD-Q-IBS-Order-qryUnderwritingOrder.do',//待核保
                qryPayOrder: '/CRUD/CRUD-Q-IBS-Order-qryPayOrder.do',//待支付
                qryIssuingOrder: '/CRUD/CRUD-Q-IBS-Order-qryIssuingOrder.do',//待收单
                qryFinishOrder: '/CRUD/CRUD-Q-IBS-Order-qryFinishOrder.do',//已完成
                issuingOrder: '/CRUD/CRUD-U-IBS-Order-issuingOrder.do',//确定收单
                qryMessage: '/CRUD/CRUD-Q-IBS-Order-qryMessage.do',//获取信息模板
                postMessage: '/CRUD/CRUD-Q-IBS-Order-postMessage.do',//发送短信
                removeOrder: '/CRUD/CRUD-U-IBS-Order-removeOrder.do',//删除订单
                supplementaryInformation: '/CRUD/CRUD-U-IBS-Order-supplementaryInformation.do',// 补充资料上传图片
                payOrder: '/CRUD/CRUD-U-IBS-Order-payOrder.do',//提交保单
                getInfo: '/CRUD/CRUD-Q-Auth-getUserInfo.do',//用户信息
                qryPayOrderInfo: '/CRUD/CRUD-Q-IBS-Order-qryPayOrderInfo.do',//支付
                qryPayCode: '/CRUD/CRUD-CQ-IBS-Order-qryPayCode.do',//支付二维码
                autoInsuranceRenewal: '/CRUD/CRUD-U-IBS-Insurance-autoInsuranceRenewal.auth',//一键续保
                findCouponsByMemberId: '/CRUD/CRUD-Q-coupon-findCouponsByMemberId.do',
                findStoreConfig:"/CRUD/CRUD-Q-storeConfig-findStoreConfig.do",
                
        };
        static phone = "4008313400";
        static tokenId:"20190102-d23023ce-0e2d-11e9-9071-7cd30abeafe0"
}





